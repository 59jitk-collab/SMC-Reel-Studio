import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';

interface Candle {
  open: number;
  close: number;
  high: number;
  low: number;
}

interface Zone {
  top: number;
  bottom: number;
  label: string;
  color: string;
  borderColor: string;
}

interface LineMarker {
  price: number;
  label: string;
  color: string;
  dashed?: boolean;
}

interface SectionData {
  id: number;
  tag: string;
  title: string;
  subtitle: string;
  points: string[];
  startSec: number;
  endSec: number;
  candles: Candle[];
  zones?: Zone[];
  lines?: LineMarker[];
}

const SECTIONS: SectionData[] = [
  {
    id: 1,
    tag: '01 / INTRODUCTION',
    title: 'SMART MONEY CONCEPTS',
    subtitle: 'Trade With Institutional Orderflow',
    points: [
      'Stop trading retail indicator traps',
      'Track where banks & institutions enter',
      'Master structure, liquidity & imbalances',
    ],
    startSec: 0,
    endSec: 6,
    candles: [
      { open: 30, close: 45, high: 50, low: 25 },
      { open: 45, close: 38, high: 48, low: 32 },
      { open: 38, close: 62, high: 68, low: 35 },
      { open: 62, close: 55, high: 65, low: 50 },
      { open: 55, close: 82, high: 88, low: 52 },
      { open: 82, close: 75, high: 85, low: 70 },
      { open: 75, close: 92, high: 96, low: 72 },
    ],
  },
  {
    id: 2,
    tag: '02 / FOUNDATION',
    title: 'MARKET STRUCTURE',
    subtitle: 'Higher Highs (HH) & Higher Lows (HL)',
    points: [
      'Bullish trend builds HH and HL swings',
      'Bearish trend builds LH and LL swings',
      'Never trade against the HTF trend direction',
    ],
    startSec: 6,
    endSec: 14,
    candles: [
      { open: 20, close: 42, high: 46, low: 16 },
      { open: 42, close: 30, high: 44, low: 26 },
      { open: 30, close: 64, high: 68, low: 28 },
      { open: 64, close: 48, high: 66, low: 44 },
      { open: 48, close: 85, high: 90, low: 46 },
      { open: 85, close: 68, high: 88, low: 64 },
      { open: 68, close: 94, high: 98, low: 66 },
    ],
    lines: [
      { price: 85, label: 'HH (Higher High)', color: '#38bdf8' },
      { price: 48, label: 'HL (Higher Low)', color: '#60a5fa', dashed: true },
    ],
  },
  {
    id: 3,
    tag: '03 / MARKET FUEL',
    title: 'LIQUIDITY POOLS',
    subtitle: 'Buy-Side (BSL) & Sell-Side (SSL) Sweeps',
    points: [
      'Equal Highs (EQH) hold retail stop losses',
      'Equal Lows (EQL) act as price magnets',
      'Wait for the liquidity sweep before entry',
    ],
    startSec: 14,
    endSec: 23,
    candles: [
      { open: 45, close: 74, high: 76, low: 40 },
      { open: 74, close: 52, high: 76, low: 48 },
      { open: 52, close: 73, high: 76, low: 50 },
      { open: 73, close: 48, high: 75, low: 44 },
      { open: 48, close: 74, high: 92, low: 46 },
      { open: 74, close: 42, high: 76, low: 38 },
      { open: 42, close: 26, high: 45, low: 22 },
    ],
    lines: [
      { price: 76, label: '$$$ BSL / EQUAL HIGHS SWEPT', color: '#f43f5e', dashed: true }, { price: 46, label: '$$$ SSL TARGET POOL', color: '#38bdf8', dashed: true },
    ],
  },
  {
    id: 4,
    tag: '04 / SHIFT SIGNALS',
    title: 'BOS & CHOCH',
    subtitle: 'Break of Structure vs Change of Character',
    points: [
      'BOS confirms trend continuation',
      'CHoCH signals the first structural reversal',
      'Demand a full candle body close beyond level',
    ],
    startSec: 23,
    endSec: 32,
    candles: [
      { open: 80, close: 58, high: 84, low: 54 },
      { open: 58, close: 70, high: 74, low: 55 },
      { open: 70, close: 40, high: 72, low: 36 },
      { open: 40, close: 56, high: 60, low: 38 },
      { open: 56, close: 26, high: 58, low: 22 },
      { open: 26, close: 66, high: 70, low: 24 },
      { open: 66, close: 88, high: 92, low: 62 },
    ],
    lines: [
      { price: 56, label: 'CHoCH (Bullish Reversal)', color: '#22c55e' },
      { price: 40, label: 'BOS (Prior Bearish Break)', color: '#38bdf8', dashed: true },
    ],
  },
  {
    id: 5,
    tag: '05 / FOOTPRINT ZONES',
    title: 'ORDER BLOCKS (OB)',
    subtitle: 'High-Probability Institutional Entry Zones',
    points: [
      'Last opposing candle before impulsive displacement',
      'Heavy institutional orders rest inside the OB',
      'Enter when price mitigates the Order Block',
    ],
    startSec: 32,
    endSec: 42,
    candles: [
      { open: 45, close: 26, high: 48, low: 22 },
      { open: 26, close: 64, high: 68, low: 24 },
      { open: 64, close: 86, high: 90, low: 60 },
      { open: 86, close: 58, high: 88, low: 54 },
      { open: 58, close: 34, high: 60, low: 28 },
      { open: 34, close: 74, high: 78, low: 32 },
      { open: 74, close: 94, high: 98, low: 70 },
    ],
    zones: [
      {
        top: 45,
        bottom: 22,
        label: 'BULLISH ORDER BLOCK (MITIGATED)',
        color: 'rgba(56, 189, 248, 0.22)',
        borderColor: '#38bdf8',
      },
    ],
  },
  {
    id: 6,
    tag: '06 / PRICE IMBALANCE',
    title: 'FAIR VALUE GAP (FVG)',
    subtitle: '3-Candle Liquidity Void & Magnet',
    points: [
      'Gap between Candle 1 High and Candle 3 Low',
      'Shows aggressive one-sided institutional buying',
      'Price rebalances the FVG before continuing',
    ],
    startSec: 42,
    endSec: 52,
    candles: [
      { open: 22, close: 36, high: 40, low: 18 },
      { open: 36, close: 82, high: 85, low: 34 },
      { open: 82, close: 92, high: 96, low: 66 },
      { open: 92, close: 72, high: 94, low: 68 },
      { open: 72, close: 52, high: 75, low: 48 },
      { open: 52, close: 80, high: 84, low: 50 },
      { open: 80, close: 95, high: 98, low: 78 },
    ],
    zones: [
      {
        top: 66,
        bottom: 40,
        label: 'FAIR VALUE GAP (FVG IMBALANCE)',
        color: 'rgba(59, 130, 246, 0.28)',
        borderColor: '#60a5fa',
      },
    ],
  },
  {
    id: 7,
    tag: '07 / EXECUTION CHECKLIST',
    title: 'FINAL SMC RECAP',
    subtitle: 'Complete High-Probability A+ Setup Plan',
    points: [
      '1. Align with HTF Market Structure + Liquidity Sweep',
      '2. Wait for LTF CHoCH with displacement',
      '3. Enter at FVG + Order Block confluence',
    ],
    startSec: 52,
    endSec: 60,
    candles: [
      { open: 35, close: 20, high: 38, low: 14 },
      { open: 20, close: 52, high: 55, low: 18 },
      { open: 52, close: 76, high: 80, low: 48 },
      { open: 76, close: 44, high: 78, low: 40 },
      { open: 44, close: 72, high: 75, low: 42 },
      { open: 72, close: 88, high: 92, low: 68 },
      { open: 88, close: 96, high: 99, low: 84 },
    ],
    zones: [
      {
        top: 48,
        bottom: 36,
        label: 'A+ CONFLUENCE ENTRY (OB + FVG)',
        color: 'rgba(34, 197, 94, 0.24)',
        borderColor: '#22c55e',
      },
    ],
    lines: [
      { price: 96, label: 'TAKE PROFIT TARGET (BSL)', color: '#22c55e' },
    ],
  },
];

const SectionSlide: React.FC<{ section: SectionData; totalDuration: number }> = ({
  section,
  totalDuration,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const fadeOut = interpolate(
    frame,
    [totalDuration - 12, totalDuration],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const chartHeight = 680;

  return (
    <AbsoluteFill
      style={{
        opacity: fadeOut,
        padding: '90px 64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        color: '#f8fafc',
      }}
    >
      {/* Top Header */}
      <div
        style={{
          transform: `translateY(${interpolate(headerSpring, [0, 1], [40, 0])}px)`,
          opacity: headerSpring,
        }}
      >
        <div
          style={{
            display: 'inline-block',
            padding: '10px 24px',
            borderRadius: 999,
            backgroundColor: 'rgba(56, 189, 248, 0.14)',
            border: '1px solid rgba(56, 189, 248, 0.45)',
            color: '#38bdf8',
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 2.5,
            marginBottom: 24,
          }}
        >
          {section.tag}
        </div>
        <div
          style={{
            fontSize: 68,
            fontWeight: 900,
            letterSpacing: -1,
            lineHeight: 1.08,
            color: '#ffffff',
            textShadow: '0 8px 32px rgba(56, 189, 248, 0.35)',
          }}
        >
          {section.title}
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 600,
            color: '#93c5fd',
            marginTop: 14,
          }}
        >
          {section.subtitle}
        </div>
      </div>

      {/* Animated Chart Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: chartHeight,
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          borderRadius: 32,
          border: '2px solid rgba(56, 189, 248, 0.28)',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.65)',
          overflow: 'hidden',
          padding: '40px 48px',
        }}
      >
        {/* Background Grid Lines */}
        {[0.2, 0.4, 0.6, 0.8].map((ratio, idx) => (
          <div
            key={idx}
            style={{
              position: 'absolute',
