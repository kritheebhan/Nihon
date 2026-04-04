-- ─────────────────────────────────────────────────────────────────────
-- Migration: add stroke_count column to the kanji table
-- Run this in the Supabase SQL Editor BEFORE running add-stroke-counts.mjs
-- ─────────────────────────────────────────────────────────────────────

ALTER TABLE public.kanji
  ADD COLUMN IF NOT EXISTS stroke_count smallint;

COMMENT ON COLUMN public.kanji.stroke_count
  IS 'Number of strokes for this kanji, sourced from KanjiVG (CC BY-SA 4.0).';
