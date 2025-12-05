-- Migration: Household Map System
-- Purpose: Create comprehensive household knowledge graph for progressive discovery
-- Date: 2024-12-05

-- ============================================================================
-- Household Facts Table
-- ============================================================================
-- This table stores all discovered facts about a customer's household.
-- Each fact has a confidence score and supporting evidence.
-- Facts are progressively discovered through purchases, conversations, and explicit answers.

CREATE TABLE IF NOT EXISTS household_facts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Fact categorization
  category TEXT NOT NULL CHECK (category IN ('physical_space', 'people', 'pets', 'lifestyle', 'patterns')),
  subcategory TEXT NOT NULL,

  -- Fact content
  fact_key TEXT NOT NULL,
  fact_value JSONB NOT NULL,

  -- Confidence & provenance
  confidence REAL NOT NULL DEFAULT 0.5 CHECK (confidence >= 0.0 AND confidence <= 1.0),
  data_points INTEGER NOT NULL DEFAULT 1,
  last_confirmed_at TIMESTAMPTZ,

  -- Source tracking
  discovered_from TEXT NOT NULL,
  supporting_evidence JSONB[] DEFAULT ARRAY[]::JSONB[],

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(user_id, fact_key)
);

-- Indexes for efficient querying
CREATE INDEX idx_household_facts_user_id ON household_facts(user_id);
CREATE INDEX idx_household_facts_category ON household_facts(category);
CREATE INDEX idx_household_facts_confidence ON household_facts(confidence);
CREATE INDEX idx_household_facts_updated_at ON household_facts(updated_at DESC);

-- RLS Policies
ALTER TABLE household_facts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own household facts"
  ON household_facts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own household facts"
  ON household_facts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own household facts"
  ON household_facts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own household facts"
  ON household_facts FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- Decision Trees Table
-- ============================================================================
-- Stores decision tree definitions for guided discovery and purchase flows

CREATE TABLE IF NOT EXISTS decision_trees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,

  -- Trigger configuration
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('product_category', 'low_confidence_fact', 'mission_start', 'explicit_request')),
  trigger_condition JSONB NOT NULL,

  purpose TEXT NOT NULL CHECK (purpose IN ('purchase_guidance', 'household_discovery', 'subscription_setup')),

  -- Tree structure (stored as JSON)
  questions JSONB NOT NULL,
  outcomes JSONB NOT NULL,

  -- Metadata
  active BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_decision_trees_trigger_type ON decision_trees(trigger_type);
CREATE INDEX idx_decision_trees_active ON decision_trees(active);

-- ============================================================================
-- Decision Tree Sessions Table
-- ============================================================================
-- Tracks active and completed decision tree sessions for users

CREATE TABLE IF NOT EXISTS decision_tree_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tree_id TEXT REFERENCES decision_trees(id) NOT NULL,

  -- Session state
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  current_question_id TEXT,
  answers JSONB DEFAULT '{}'::JSONB,

  -- Results
  outcome_id TEXT,
  facts_discovered JSONB[] DEFAULT ARRAY[]::JSONB[],

  -- Timestamps
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  last_interaction_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_decision_tree_sessions_user_id ON decision_tree_sessions(user_id);
CREATE INDEX idx_decision_tree_sessions_status ON decision_tree_sessions(status);
CREATE INDEX idx_decision_tree_sessions_tree_id ON decision_tree_sessions(tree_id);

-- RLS Policies
ALTER TABLE decision_tree_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own decision tree sessions"
  ON decision_tree_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own decision tree sessions"
  ON decision_tree_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own decision tree sessions"
  ON decision_tree_sessions FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================================================
-- Household Map Snapshots Table
-- ============================================================================
-- Periodic snapshots of the complete household map for analytics and debugging

CREATE TABLE IF NOT EXISTS household_map_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Snapshot data
  completeness REAL NOT NULL,
  total_facts INTEGER NOT NULL,
  facts_by_category JSONB NOT NULL,
  aggregated_map JSONB NOT NULL,

  -- Snapshot metadata
  snapshot_type TEXT NOT NULL DEFAULT 'periodic' CHECK (snapshot_type IN ('periodic', 'milestone', 'manual')),
  trigger_reason TEXT,

  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_household_map_snapshots_user_id ON household_map_snapshots(user_id);
CREATE INDEX idx_household_map_snapshots_created_at ON household_map_snapshots(created_at DESC);

-- RLS Policies
ALTER TABLE household_map_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own household map snapshots"
  ON household_map_snapshots FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================================
-- Functions
-- ============================================================================

-- Function to update household fact
CREATE OR REPLACE FUNCTION update_household_fact(
  p_user_id UUID,
  p_fact_key TEXT,
  p_fact_value JSONB,
  p_category TEXT,
  p_subcategory TEXT,
  p_confidence REAL,
  p_discovered_from TEXT,
  p_evidence JSONB
) RETURNS household_facts AS $$
DECLARE
  v_fact household_facts;
  v_existing household_facts;
BEGIN
  -- Check if fact already exists
  SELECT * INTO v_existing
  FROM household_facts
  WHERE user_id = p_user_id AND fact_key = p_fact_key;

  IF v_existing.id IS NOT NULL THEN
    -- Update existing fact
    UPDATE household_facts
    SET
      fact_value = p_fact_value,
      confidence = LEAST(1.0, v_existing.confidence + (p_confidence - v_existing.confidence) * 0.3),
      data_points = v_existing.data_points + 1,
      supporting_evidence = array_append(v_existing.supporting_evidence, p_evidence),
      updated_at = now()
    WHERE id = v_existing.id
    RETURNING * INTO v_fact;
  ELSE
    -- Insert new fact
    INSERT INTO household_facts (
      user_id,
      category,
      subcategory,
      fact_key,
      fact_value,
      confidence,
      discovered_from,
      supporting_evidence
    ) VALUES (
      p_user_id,
      p_category,
      p_subcategory,
      p_fact_key,
      p_fact_value,
      p_confidence,
      p_discovered_from,
      ARRAY[p_evidence]
    )
    RETURNING * INTO v_fact;
  END IF;

  RETURN v_fact;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get household map completeness
CREATE OR REPLACE FUNCTION get_household_map_completeness(p_user_id UUID)
RETURNS REAL AS $$
DECLARE
  v_total_facts INTEGER;
  v_completeness REAL;
BEGIN
  SELECT COUNT(*) INTO v_total_facts
  FROM household_facts
  WHERE user_id = p_user_id;

  -- Completeness calculation
  -- 0 facts = 0%, 10 facts = 20%, 25 facts = 50%, 50+ facts = 100%
  v_completeness := LEAST(100.0, (v_total_facts::REAL / 50.0) * 100.0);

  RETURN v_completeness;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get low confidence facts
CREATE OR REPLACE FUNCTION get_low_confidence_facts(
  p_user_id UUID,
  p_threshold REAL DEFAULT 0.7
)
RETURNS SETOF household_facts AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM household_facts
  WHERE user_id = p_user_id
    AND confidence < p_threshold
  ORDER BY confidence ASC, updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Seed Data: Default Decision Trees
-- ============================================================================

-- Baby product discovery tree
INSERT INTO decision_trees (id, name, description, trigger_type, trigger_condition, purpose, questions, outcomes)
VALUES (
  'baby_discovery',
  'Baby Product Discovery',
  'Discovers household facts when user shops for baby products',
  'product_category',
  '{"category": "Baby Food & Formula"}'::JSONB,
  'household_discovery',
  '[
    {
      "id": "has_baby",
      "question": "Are you shopping for a baby?",
      "answerType": "single_choice",
      "options": [
        {"value": "yes_my_baby", "label": "Yes, my baby"},
        {"value": "yes_gift", "label": "Yes, as a gift"},
        {"value": "expecting", "label": "I am expecting"},
        {"value": "no", "label": "No, just browsing"}
      ],
      "discovers": [{
        "factKey": "has_baby",
        "category": "people",
        "subcategory": "household_member",
        "valueMapping": {
          "yes_my_baby": true,
          "yes_gift": false,
          "expecting": false,
          "no": false
        },
        "confidence": 1.0
      }]
    },
    {
      "id": "baby_age",
      "question": "How old is your baby?",
      "answerType": "single_choice",
      "options": [
        {"value": "0-3mo", "label": "0-3 months (newborn)"},
        {"value": "3-6mo", "label": "3-6 months"},
        {"value": "6-12mo", "label": "6-12 months"},
        {"value": "12-24mo", "label": "12-24 months (toddler)"}
      ],
      "discovers": [{
        "factKey": "baby_age",
        "category": "people",
        "subcategory": "household_member",
        "valueMapping": {
          "0-3mo": "0-3 months",
          "3-6mo": "3-6 months",
          "6-12mo": "6-12 months",
          "12-24mo": "12-24 months"
        },
        "confidence": 1.0
      }]
    }
  ]'::JSONB,
  '[
    {
      "id": "has_baby_outcome",
      "factsToSave": [
        {"factKey": "has_baby", "factValue": true, "confidence": 1.0},
        {"factKey": "life_stage", "factValue": "young_family", "confidence": 0.9}
      ],
      "recommendations": [
        "Subscribe to diapers and formula for 15% savings",
        "Set up auto-delivery based on your baby age"
      ]
    }
  ]'::JSONB
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE household_facts IS 'Progressive discovery system: stores all facts about customer households';
COMMENT ON TABLE decision_trees IS 'Decision tree definitions for guided discovery flows';
COMMENT ON TABLE decision_tree_sessions IS 'Active and completed decision tree sessions';
COMMENT ON TABLE household_map_snapshots IS 'Periodic snapshots of household maps for analytics';

COMMENT ON FUNCTION update_household_fact IS 'Inserts or updates a household fact with confidence blending';
COMMENT ON FUNCTION get_household_map_completeness IS 'Calculates map completeness percentage (0-100%)';
COMMENT ON FUNCTION get_low_confidence_facts IS 'Returns facts below confidence threshold needing confirmation';
