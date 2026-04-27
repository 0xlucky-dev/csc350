# 🔥 IRON RULES FOR INTELLIGENT-RL-TRAIN PROJECT

**Last Updated:** 2025-12-11  
**Spec Version:** v20251211  
**Project:** Intelligent RL Trading Agent

---

## ทุกอย่างเป็นภาษาไทยเพราะ user และ dev คือคนไทย

## ⚠️ CRITICAL: READ BEFORE ANY IMPLEMENTATION

These are **ABSOLUTE RULES** that MUST be followed. Breaking these rules will result in:
- ❌ Messy codebase
- ❌ Duplicate code
- ❌ Unused files/functions
- ❌ Lost context
- ❌ Production failures

---

## 🚫 RULE #1: NO THROWAWAY CODE (ห้ามสร้างแบบทิ้งๆ ขว้างๆ)

### ❌ FORBIDDEN:
- Creating new files without clear purpose
- Creating new functions when existing ones can be modified
- Leaving unused files in the codebase
- Leaving unused functions in files
- Creating "temporary" or "test" files that stay forever

### ✅ REQUIRED:
1. **Before creating ANY new file:**
   - Check if similar file exists
   - Check if existing file can be extended
   - Document WHY new file is needed

2. **Before creating ANY new function:**
   - Search for existing similar functions
   - Try to modify existing function first
   - Only create new if absolutely necessary
   - Document WHY new function is needed

3. **Every file MUST be used:**
   - If file is not imported/used → DELETE IT
   - If file is "for future use" → DON'T CREATE IT YET

4. **Every function MUST be used:**
   - If function is not called → DELETE IT
   - If function is "for future use" → DON'T CREATE IT YET

### 📋 Checklist Before Creating New Code:

```
□ Did I search for existing similar code?
□ Can I modify existing code instead?
□ Is this code actually needed NOW?
□ Will this code be used immediately?
□ Did I document WHY this is needed?
```

**IF ANY ANSWER IS "NO" → DON'T CREATE IT!**

---

## 📝 RULE #2: MANDATORY FILE HEADERS (ต้องมีคอมเม้นข้อมูลสำคัญ)

### ❌ FORBIDDEN:
- Files without headers
- Minimal or generic headers
- Headers without critical context
- Missing dependency information
- Missing related files information

### ✅ REQUIRED:

**EVERY implementation file MUST have this EXACT header format:**

```python
"""
FILE: <filename>
PURPOSE: <one-line description of what this file does>

⚠️ CONFIGURATION: ALL values imported from config/config.py
   DO NOT hardcode any values in this file!
   
CRITICAL CONTEXT (from design.md + tasks.md):
  - Walk-Forward Validation: 4 windows (2015-2020→2021, 2016-2021→2022, 2017-2022→2023, 2018-2023→2024)
  - Slippage Buffer: 0.02 USD on ALL TP/SL (reduces backtest-prod gap 47.5%→3.8%)
  - Data: 10-year XAUUSD 1m (2015-2024) from Dukascopy (.parquet format)
  - Architecture: 394-dim embedding from 6 TFs via CNN (5m:64, 15m:128, 30m:64, 1h:64, 4h:32, 1d:32, meta:10)
  - Sequence: 200 timesteps of 15m bars (50 hours context)
  - Parallel Envs: 8 environments (2-4× faster training)
  - Early Stopping: patience=20 episodes, min_delta=0.01, metric=val_win_rate
  - Experience Replay: PER (α=0.6, β=0.4→1.0) + Recency Mix (60% recent, 40% old) + Regime Stratification (10% min per regime)
  - Pattern Memory: Cosine similarity >0.85, prune after 1M steps (occurrences<10, win_rate<0.25, last_seen>180d)
  - Auxiliary Heads: Volatility (3-class) + Regime (5-class) with 0.1× weight
  - Curriculum Learning: 4 stages (3mo→6mo→12mo→10yr), advance when win_rate>60%
  - Regime Detection: ADX>25 (trending), ADX<20 (ranging), ATR>2×avg (volatile)
  - Safety Rules: No long if price<EMA200_4H (unless conf>0.98), no trade ±30min macro events
  - Volume Normalization: Universal adaptive (works with ANY source: Dukascopy, MT5, Binance)
  - Modular Design: Core (encoder, agent, env, trainer) + Optional Modules (A-J)

DEPENDENCIES:
  - config.config: ALL configuration values (MUST import from here!)
  - <list other key dependencies that this file needs>

RELATED FILES:
  - config/config.py: Central configuration (MUST update if changing values)
  - <list files that must be updated together with this file>

VALIDATION STRATEGY:
  - Window 1: Train 2015-2020 (6y) → Val 2021 (1y) → Expected: 55% ± 3%
  - Window 2: Train 2016-2021 (6y) → Val 2022 (1y) → Expected: 58% ± 3%
  - Window 3: Train 2017-2022 (6y) → Val 2023 (1y) → Expected: 52% ± 3%
  - Window 4: Train 2018-2023 (6y) → Val 2024 (1y) → Expected: 56% ± 3%
  - Aggregate: Average 55.25% ± 2.5% (stable = production-ready!)

LAST UPDATED: <date>
SPEC VERSION: v20251211
DESIGN: .kiro/specs/intelligent-rl-train/design.md
TASKS: .kiro/specs/intelligent-rl-train/tasks.md
"""
```

### 📋 Header Checklist:

```
□ File has complete header at the top?
□ Header includes PURPOSE?
□ Header includes CRITICAL CONTEXT?
□ Header includes DEPENDENCIES?
□ Header includes RELATED FILES?
□ Header includes VALIDATION STRATEGY?
□ Header includes spec version and doc paths?
```

**IF ANY ANSWER IS "NO" → FIX IT BEFORE PROCEEDING!**

---

## 🏗️ RULE #3: PRODUCTION-GRADE ONLY (เน้นประสิทธิภาพระยะยาว)

### ❌ FORBIDDEN:
- Quick fixes that need rework later
- "Good enough for now" solutions
- Temporary workarounds
- Hardcoded values
- Copy-paste code
- "Will refactor later" code

### ✅ REQUIRED:

1. **Think Long-Term:**
   - Will this code work in 1 year?
   - Will this code scale?
   - Will this code be maintainable?
   - Will this code be testable?

2. **Production-Grade Standards:**
   - ✅ All values from config.py
   - ✅ Proper error handling
   - ✅ Comprehensive logging
   - ✅ Type hints
   - ✅ Docstrings
   - ✅ Unit tests (when required)
   - ✅ Performance optimized

3. **No Quick Fixes:**
   - If solution is temporary → DON'T DO IT
   - If solution needs rework later → DO IT RIGHT NOW
   - If solution is "good enough" → MAKE IT EXCELLENT

4. **Code Quality:**
   - Clean, readable code
   - Self-documenting variable names
   - Logical structure
   - DRY (Don't Repeat Yourself)
   - SOLID principles

---

## 🔍 RULE #4: SYSTEM INTEGRITY (ห้ามแก้แล้วจุดอื่นพัง)

### ❌ FORBIDDEN:
- Modifying a function without checking related functions
- Adding features that break existing functionality
- Deleting code without checking dependencies
- Changing interfaces without updating all callers
- Refactoring one part while ignoring the pipeline

### ✅ REQUIRED:

**BEFORE modifying ANY function:**

1. **Map the dependency graph:**
   ```
   ฟังก์ชั่นที่จะแก้
   ↓
   ใครเรียกใช้? (callers)
   ↓
   เรียกใครบ้าง? (callees)
   ↓
   ทำงานใน pipeline ไหน?
   ↓
   มีฟังก์ชั่นอื่นทับซ้อนไหม?
   ```

2. **Check ALL related functions:**
   - ✅ Functions that call this function (callers)
   - ✅ Functions that this function calls (callees)
   - ✅ Functions in the same pipeline
   - ✅ Functions with overlapping functionality
   - ✅ Functions that depend on same data

3. **Refactor ALL related code together:**
   - ✅ Update function signature → Update all callers
   - ✅ Change return type → Update all users
   - ✅ Modify behavior → Update all dependencies
   - ✅ Add parameter → Update all call sites
   - ✅ Remove parameter → Update all call sites

4. **Test the ENTIRE pipeline:**
   - ✅ Test modified function
   - ✅ Test all callers
   - ✅ Test all callees
   - ✅ Test end-to-end pipeline
   - ✅ Verify nothing broke

### 📋 Dependency Check Checklist:

```
□ Listed all functions that call this function?
□ Listed all functions that this function calls?
□ Identified the pipeline this function belongs to?
□ Found all overlapping/duplicate functionality?
□ Checked for shared data dependencies?
□ Updated ALL related functions?
□ Tested ALL related functions?
□ Verified end-to-end pipeline works?
□ No broken functionality anywhere?
```

**IF ANY ANSWER IS "NO" → DON'T COMMIT!**

---

## 🔍 RULE #5: COMPREHENSIVE DEBUG MODE (ต้อง Debug ได้ทุกอย่าง!)

### 🚨 CRITICAL LESSON FROM PAST PROJECT:
**เทรน 50 ล้านรอบแล้วถึงรู้ว่า:**
- Agent มองเห็นราคาแค่แท่งเดียว (ไม่มีประวัติ!)
- Agent ไม่มีความจำในอดีต
- Agent ใช้ indicator ไม่ถูก
- ไม่รู้เหตุผลของการตัดสินใจ
- **ห้ามให้เกิดอีก!**

### ⚠️ ABSOLUTE REQUIREMENTS:

1. **ONE DEBUG FLAG TO RULE THEM ALL**
   ```python
   # In config/config.py:
   DEBUG_MODE = True  # Master switch for ALL debug features
   
   # When DEBUG_MODE = True:
   # - Log EVERYTHING
   # - Save agent thoughts to files
   # - Convert vectors to human-readable context
   # - Show decision reasoning
   # - Track all variables
   # - Validate all assumptions
   ```

2. **EVERY FUNCTION MUST BE DEBUGGABLE (MANDATORY!)**
   
   **🚨 CRITICAL: ALL classes MUST:**
   - Import DEBUG_MODE from config.config
   - Store self.debug_mode = DEBUG_MODE in __init__
   - Add debug logging in ALL important methods
   - Log inputs, outputs, and reasoning
   
   ```python
   # ❌ WRONG: No DEBUG_MODE
   class RegimeDetector:
       def __init__(self):
           self.threshold = 25
       
       def detect(self, state):
           regime = self._classify(state)
           return regime
   
   # ✅ RIGHT: Has DEBUG_MODE
   from config.config import DEBUG_MODE
   import logging
   
   logger = logging.getLogger(__name__)
   
   class RegimeDetector:
       def __init__(self):
           self.debug_mode = DEBUG_MODE  # ← MUST HAVE!
           self.threshold = 25
           
           if self.debug_mode:
               logger.info("RegimeDetector initialized with DEBUG_MODE=True")
               logger.info(f"  Threshold: {self.threshold}")
           else:
               logger.info("RegimeDetector initialized with DEBUG_MODE=False")
       
       def detect(self, state):
           # Debug logging BEFORE processing
           if self.debug_mode:
               logger.debug(f"Detecting regime from state: {state.shape}")
           
           regime = self._classify(state)
           
           # Debug logging AFTER processing
           if self.debug_mode:
               logger.debug(f"  Detected regime: {regime}")
               logger.debug(f"  Confidence: {self.confidence:.2f}")
           
           return regime
   ```
   
   **📋 DEBUG_MODE Checklist for EVERY class:**
   ```
   □ Imports DEBUG_MODE from config.config?
   □ Has self.debug_mode = DEBUG_MODE in __init__?
   □ Logs initialization with DEBUG_MODE status?
   □ Has debug logging in ALL important methods?
   □ Logs inputs (what goes in)?
   □ Logs outputs (what comes out)?
   □ Logs reasoning (why this result)?
   □ Uses if self.debug_mode: before logging?
   ```
   
   **IF ANY ANSWER IS "NO" → FIX IT IMMEDIATELY!**

3. **VECTOR → CONTEXT CONVERSION (MANDATORY!)**
   ```python
   def decode_state_to_context(state: np.ndarray) -> Dict:
       """
       Convert 394-dim vector to human-readable context.
       
       ⚠️ CRITICAL: Agent sees vectors, humans need context!
       This function MUST decode EVERYTHING the agent sees.
       
       Returns:
           {
               '5m_timeframe': {
                   'price': 2000.50,
                   'ema_8': 1998.20,
                   'ema_21': 1995.10,
                   'rsi': 65.5,
                   'macd': 1.2,
                   'trend': 'bullish',
                   'last_20_bars': [...],  # Price history
               },
               '15m_timeframe': {...},
               '30m_timeframe': {...},
               '1h_timeframe': {...},
               '4h_timeframe': {...},
               '1d_timeframe': {...},
               'meta': {
                   'hour': 14,
                   'session': 'NY_open',
                   'volume_spike': False,
               }
           }
       """
       pass
   ```

4. **AGENT THOUGHT LOGGING (EVERY DECISION!)**
   ```python
   # When DEBUG_MODE = True, save to: logs/debug/agent_thoughts/
   # Format: agent_thoughts_YYYYMMDD_HHMMSS.jsonl
   
   {
       "timestamp": "2024-01-15 14:30:00",
       "step": 12345,
       "context": {
           "5m": {"price": 2000.50, "ema_8": 1998.20, ...},
           "15m": {...},
           ...
       },
       "agent_sees": {
           "trend_5m": "bullish",
           "trend_15m": "bullish",
           "trend_1h": "ranging",
           "confluence": "mixed_signals",
           "support": 1995.00,
           "resistance": 2005.00
       },
       "decision": {
           "action": "OPEN_LONG",
           "sl_mult": 2.0,
           "tp_mult": 3.0,
           "confidence": 0.75,
           "reasoning": [
               "5m and 15m both bullish",
               "Price above EMA8 and EMA21",
               "RSI not overbought (65.5)",
               "Volume spike detected",
               "Near support level (1995.00)"
           ],
           "risks": [
               "1h timeframe ranging",
               "Resistance nearby (2005.00)"
           ],
           "alternatives_considered": [
               {"action": "HOLD", "score": 0.60, "reason": "Wait for 1h confirmation"},
               {"action": "OPEN_SHORT", "score": 0.20, "reason": "Resistance nearby"}
           ]
       },
       "outcome": {
           "result": "TP_HIT",
           "pnl": 15.50,
           "duration_bars": 45
       }
   }
   ```

5. **TRAINING VALIDATION (EVERY EPISODE!)**
   ```python
   # When DEBUG_MODE = True, validate:
   
   def validate_training_step(episode: int):
       """
       Validate that agent is learning correctly.
       
       ⚠️ CHECKS:
       1. Agent sees full history (not just 1 bar!)
       2. Agent uses indicators correctly
       3. Agent has memory (LSTM hidden state)
       4. Agent reasoning makes sense
       5. Agent explores different actions
       """
       checks = {
           'sees_history': check_agent_sees_history(),
           'uses_indicators': check_indicator_usage(),
           'has_memory': check_lstm_hidden_state(),
           'reasoning_valid': check_reasoning_logic(),
           'explores': check_action_diversity()
       }
       
       if not all(checks.values()):
           logger.error(f"⚠️ TRAINING VALIDATION FAILED: {checks}")
           raise TrainingValidationError(checks)
   ```

6. **DEBUG OUTPUT STRUCTURE**
   ```
   logs/debug/
   ├── agent_thoughts/          # Every decision with full context
   │   ├── 20241215_140000.jsonl
   │   └── 20241215_150000.jsonl
   ├── state_vectors/           # Raw vectors + decoded context
   │   ├── episode_0001.jsonl
   │   └── episode_0002.jsonl
   ├── training_validation/     # Validation checks per episode
   │   ├── episode_0001.json
   │   └── episode_0002.json
   ├── indicator_values/        # All indicator calculations
   │   ├── 20241215.csv
   │   └── 20241216.csv
   └── decision_analysis/       # Why agent chose each action
       ├── 20241215.jsonl
       └── 20241216.jsonl
   ```

### 📋 Debug Mode Checklist:

```
□ DEBUG_MODE flag in config.py?
□ Every function logs when DEBUG_MODE=True?
□ Vector→Context decoder implemented?
□ Agent thoughts saved to files?
□ Decision reasoning explained?
□ All indicators logged?
□ Training validation checks?
□ Alternative actions logged?
□ Confidence scores tracked?
□ LSTM hidden state verified?
□ Action diversity monitored?
□ Can answer: "Why did agent do X?"
□ Can answer: "What does agent see?"
□ Can answer: "Is agent learning correctly?"
```

**IF ANY ANSWER IS "NO" → IMPLEMENT IT!**

### 🎯 DEBUG MODE GOALS:

1. **Never waste training time again**
   - Know immediately if agent sees data correctly
   - Know immediately if agent uses indicators correctly
   - Know immediately if agent has memory

2. **Understand every decision**
   - Why did agent go long here?
   - What indicators influenced the decision?
   - What alternatives did agent consider?

3. **Validate training progress**
   - Is agent exploring enough?
   - Is agent learning patterns?
   - Is agent reasoning improving?

4. **Quick problem diagnosis**
   - Agent not learning? Check debug logs
   - Agent making bad decisions? Check reasoning
   - Agent ignoring indicators? Check state decoder

### ⚠️ PERFORMANCE NOTE:

- DEBUG_MODE will slow training by ~20-30%
- **THIS IS ACCEPTABLE!**
- Better to train slower with visibility than fast and blind
- Disable DEBUG_MODE only after confirming agent works correctly

### 📋 Production-Grade Checklist:

```
□ Code will work long-term (1+ years)?
□ Code is scalable?
□ Code is maintainable?
□ Code is testable?
□ All values from config.py?
□ Proper error handling?
□ Comprehensive logging?
□ Type hints added?
□ Docstrings complete?
□ No hardcoded values?
□ No copy-paste code?
□ No temporary workarounds?
□ Debug mode implemented?
□ Vector→Context decoder exists?
□ Decision reasoning logged?
```

**IF ANY ANSWER IS "NO" → FIX IT BEFORE PROCEEDING!**

---

## 🎯 IMPLEMENTATION WORKFLOW

### Step 1: BEFORE Writing ANY Code

1. ✅ Read `.kiro/specs/intelligent-rl-train/design.md` completely
2. ✅ Read `.kiro/specs/intelligent-rl-train/tasks.md` for current task
3. ✅ Read `.kiro/specs/intelligent-rl-train/requirements.md` for requirements
4. ✅ Check if similar code exists
5. ✅ Check if existing code can be modified
6. ✅ Plan the implementation
7. ✅ Verify against all 5 rules above

### Step 2: DURING Implementation

1. ✅ Add complete file header (Rule #2)
2. ✅ Import ALL values from config.py (Rule #3)
3. ✅ Write production-grade code (Rule #3)
4. ✅ Add type hints and docstrings
5. ✅ Add error handling and logging
6. ✅ Test the code
7. ✅ Verify no unused code (Rule #1)

### Step 3: AFTER Implementation

1. ✅ Verify file is used/imported
2. ✅ Verify all functions are called
3. ✅ Verify no hardcoded values
4. ✅ Verify header is complete
5. ✅ Verify code is production-grade
6. ✅ Update related files if needed
7. ✅ Document changes

---

## 🚨 ABSOLUTE PROHIBITIONS

### ❌ NEVER DO THESE:

1. **NEVER hardcode configuration values**
   ```python
   # ❌ WRONG:
   slippage_buffer = 0.02
   num_envs = 8
   learning_rate = 1e-4
   
   # ✅ RIGHT:
   from config.config import SLIPPAGE_BUFFER, NUM_ENVS, LEARNING_RATE
   ```

2. **NEVER create files without headers**
   ```python
   # ❌ WRONG:
   import pandas as pd
   
   def train():
       pass
   
   # ✅ RIGHT:
   """
   FILE: train.py
   PURPOSE: Training script with Walk-Forward Validation
   
   [... complete header ...]
   """
   import pandas as pd
   
   def train():
       pass
   ```

3. **NEVER create unused code**
   ```python
   # ❌ WRONG:
   def helper_function():  # Never called!
       pass
   
   def main():
       pass
   
   # ✅ RIGHT:
   def main():
       pass  # Only functions that are used
   ```

4. **NEVER use quick fixes**
   ```python
   # ❌ WRONG:
   try:
       result = risky_operation()
   except:
       result = None  # Quick fix!
   
   # ✅ RIGHT:
   try:
       result = risky_operation()
   except SpecificException as e:
       logger.error(f"Operation failed: {e}")
       raise  # Proper error handling
   ```

5. **NEVER skip documentation**
   ```python
   # ❌ WRONG:
   def calculate(x, y):
       return x * y + 10
   
   # ✅ RIGHT:
   def calculate_reward(profit: float, risk: float) -> float:
       """
       Calculate reward with risk adjustment
       
       Args:
           profit: Realized profit/loss (percentage)
           risk: Position risk (percentage)
           
       Returns:
           Adjusted reward value
           
       Formula:
           reward = profit * risk_multiplier + base_reward
       """
       return profit * risk + 10
   ```

---

## 📚 REFERENCE DOCUMENTS

**MUST READ before implementation:**

1. **Design Document:** `.kiro/specs/intelligent-rl-train/design.md`
   - Complete system architecture
   - All configuration values
   - Documentation standards
   - Module descriptions

2. **Tasks Document:** `.kiro/specs/intelligent-rl-train/tasks.md`
   - Implementation plan
   - Task order (Phase 0 → 1 → 2 → 3 → 4 → 5)
   - Task details and requirements

3. **Requirements Document:** `.kiro/specs/intelligent-rl-train/requirements.md`
   - All 38 requirements
   - Acceptance criteria
   - Validation rules

---

## ✅ COMPLIANCE VERIFICATION

Before submitting ANY code, verify:

```
RULE #1: NO THROWAWAY CODE
□ No unused files?
□ No unused functions?
□ All code is necessary?
□ Checked for existing similar code?
□ Modified existing code when possible?

RULE #2: MANDATORY FILE HEADERS
□ Every file has complete header?
□ Header includes all critical context?
□ Header includes dependencies?
□ Header includes related files?
□ Header includes validation strategy?

RULE #3: PRODUCTION-GRADE ONLY
□ Code is long-term maintainable?
□ All values from config.py?
□ Proper error handling?
□ Type hints and docstrings?
□ No hardcoded values?
□ No quick fixes?
□ No temporary workarounds?

RULE #4: SYSTEM INTEGRITY
□ Mapped all dependencies?
□ Updated all callers?
□ Updated all callees?
□ Updated pipeline functions?
□ Tested entire pipeline?

RULE #5: COMPREHENSIVE DEBUG MODE
□ DEBUG_MODE flag in config.py?
□ Vector→Context decoder implemented?
□ Agent thoughts logged?
□ Decision reasoning explained?
□ Training validation checks?
```

**ALL BOXES MUST BE CHECKED! ✅**

---

## 📝 RULE #6: MANDATORY README.md UPDATES (ต้องอัพเดท README ทุกครั้ง!)

### ❌ FORBIDDEN:
- Completing tasks without updating README.md
- README.md out of sync with actual code
- Missing file paths in README.md
- Vague descriptions without file names
- Outdated project structure

### 🇹🇭 ทำไมต้องอัพเดท README?

**ปัญหาที่เคยเจอ:**
- ทำ task เสร็จแล้ว แต่ README ไม่ได้อัพเดท → ไม่รู้ว่าทำอะไรไปแล้วบ้าง
- มี class ใหม่ แต่ README ไม่บอก → ไม่รู้ว่าต้อง import จากไหน
- เปลี่ยนชื่อ class แล้ว แต่ README ยังใช้ชื่อเก่า → สับสน!
- มี test ผ่านแล้ว แต่ README ไม่บอก → ไม่รู้ว่าระบบใช้งานได้หรือยัง

**วิธีแก้:**
- ทำ task เสร็จ → อัพเดท README ทันที!
- เพิ่มไฟล์ใหม่ → เพิ่มใน README ทันที!
- เปลี่ยนชื่อ class → แก้ README ทันที!
- Test ผ่าน → อัพเดทจำนวน test ใน README ทันที!

### ✅ REQUIRED:

**AFTER completing ANY task, MUST update README.md with:**

1. **Project Structure (Path Diagram)**
   ```
   intelligent-rl-train/
   ├── README.md                    # Project overview
   ├── requirements.txt             # Dependencies
   │
   ├── config/
   │   ├── config.py               # Central configuration (ALL values here!)
   │   └── __init__.py
   │
   ├── core/
   │   ├── multi_tf_encoder.py     # MultiTFEncoder (394-dim, 6 TFs)
   │   └── __init__.py
   │
   ├── utils/
   │   ├── debug_logger.py         # DebugLogger (agent thoughts, state vectors)
   │   ├── state_decoder.py        # StateDecoder (394-dim → human-readable)
   │   ├── training_validator.py   # TrainingValidator (sanity checks)
   │   └── __init__.py
   │
   ├── tests/
   │   ├── test_debug_system.py    # Debug system tests (23 tests)
   │   ├── test_multi_tf_encoder.py # Encoder tests (24 tests)
   │   └── __init__.py
   │
   ├── data/                       # Training data (XAUUSD_1m_10Year.csv)
   ├── models/                     # Saved models (.pt files)
   └── logs/                       # Training logs
       └── debug/                  # Debug logs (when DEBUG_MODE=True)
   ```

2. **File Descriptions (Short & Clear)**
   - Include file path
   - Include class/function names
   - Include purpose (1 line)
   
   **🇹🇭 ตัวอย่างที่ดี:**
   ```
   core/multi_tf_encoder.py - MultiTFEncoder
     → Encodes 6 TFs (5m, 15m, 30m, 1h, 4h, 1d) to 394-dim embedding
     → Uses CNN compression per TF
     → Functions: calculate_ema_features(), detect_market_structure(), 
                  normalize_volume_universal(), etc.
   ```
   
   **🇹🇭 ตัวอย่างที่แย่:**
   ```
   ❌ encoder.py - Encoder (ไม่บอก path, ไม่บอก class name)
   ❌ core/encoder.py - Encodes data (ไม่บอกว่า encode อะไร)
   ❌ Encoder for features (ไม่บอก path, ไม่บอก class name)
   ```

3. **Current Status Section**
   - Update completed phases
   - Update current phase
   - Update test counts
   
   **🇹🇭 ตัวอย่าง:**
   ```
   ## 📊 Current Status
   
   **Completed:**
   - ✅ Phase 0: Debug System (23 tests passing)
   - ✅ Phase 1: Feature Engineering (24 tests passing)
   
   **In Progress:**
   - 🔄 Phase 2: Regime Detection & Safety Rules
   
   **Next:**
   - ⏳ Phase 3: LSTM with Auxiliary Heads
   ```
   
   **🇹🇭 สิ่งที่ต้องอัพเดท:**
   - ✅ เครื่องหมาย (✅ = เสร็จ, 🔄 = กำลังทำ, ⏳ = ยังไม่ทำ)
   - ✅ จำนวน tests (เช่น "23 tests passing")
   - ✅ Phase ที่กำลังทำอยู่
   - ✅ Phase ถัดไป

4. **Important Information (Concise)**
   - Architecture summary (394-dim, 6 TFs, etc.)
   - Key features (Walk-Forward Validation, Slippage Buffer, etc.)
   - Debug mode info (DEBUG_MODE flag)
   - Training approach (Parallel Envs, Sequential Learning, etc.)
   
   **🇹🇭 ข้อมูลสำคัญที่ต้องมี:**
   - 🏗️ Architecture: 394-dim, 6 TFs, LSTM, etc.
   - 🎯 Key Features: Walk-Forward Validation, Slippage Buffer
   - 🔍 Debug Mode: DEBUG_MODE flag (เปิด/ปิด)
   - 🚀 Training: Parallel Envs (8 envs), Sequential Learning
   - ✅ Tests: จำนวน tests ที่ผ่าน (เช่น 47/47 tests passing)

### 📋 README Update Checklist:

```
□ Updated project structure diagram?
□ Added/updated file descriptions?
□ Updated current status section?
□ Updated test counts?
□ Updated completed phases?
□ Removed outdated information?
□ All file paths are correct?
□ All class names are correct?
```

**IF ANY ANSWER IS "NO" → UPDATE README BEFORE PROCEEDING!**

---

## 📝 RULE #7: MANDATORY PROCESS.EXIT() IN ALL SCRIPTS (สคริปต์ต้องหยุดเอง!)

### ❌ FORBIDDEN:
- Scripts that don't exit after completion
- Scripts that hang indefinitely
- Scripts without proper exit codes
- Missing process.exit() in async functions

### 🇹🇭 ทำไมต้องมี process.exit()?

**ปัญหาที่เคยเจอ:**
- รันสคริปต์เสร็จแล้ว แต่ process ยังค้างอยู่ → ต้อง Ctrl+C ปิดเอง
- Error แล้ว แต่ process ไม่หยุด → ไม่รู้ว่าจบแล้วหรือยัง
- Test ผ่านแล้ว แต่ต้องรอนาน → เสียเวลาโดยใช่เหตุ
- CI/CD pipeline ค้าง → ไม่รู้ว่า script เสร็จหรือยัง

**วิธีแก้:**
- Script เสร็จ → `process.exit(0)` ทันที!
- Script error → `process.exit(1)` ทันที!
- Async function เสร็จ → ต้องมี exit ด้วย!

### ✅ REQUIRED:

**EVERY standalone script MUST have process.exit():**

1. **Node.js/JavaScript Scripts**
   ```javascript
   // ❌ WRONG: No process.exit()
   async function main() {
     try {
       const result = await doSomething()
       console.log('✅ Success:', result)
     } catch (error) {
       console.error('❌ Error:', error.message)
     }
   }
   
   main()  // Script will hang!
   
   // ✅ RIGHT: Has process.exit()
   async function main() {
     try {
       const result = await doSomething()
       console.log('✅ Success:', result)
       process.exit(0)  // Exit with success code
     } catch (error) {
       console.error('❌ Error:', error.message)
       process.exit(1)  // Exit with error code
     }
   }
   
   main()
   ```

2. **Python Scripts**
   ```python
   # ❌ WRONG: No sys.exit()
   import asyncio
   
   async def main():
       try:
           result = await do_something()
           print(f'✅ Success: {result}')
       except Exception as e:
           print(f'❌ Error: {e}')
   
   asyncio.run(main())  # Script will hang!
   
   # ✅ RIGHT: Has sys.exit()
   import sys
   import asyncio
   
   async def main():
       try:
           result = await do_something()
           print(f'✅ Success: {result}')
           sys.exit(0)  # Exit with success code
       except Exception as e:
           print(f'❌ Error: {e}')
           sys.exit(1)  # Exit with error code
   
   asyncio.run(main())
   ```

3. **Test Scripts**
   ```javascript
   // ✅ Test script with proper exit
   async function runTests() {
     console.log('='.repeat(80))
     console.log('RUNNING TESTS')
     console.log('='.repeat(80))
     
     try {
       // Run all tests
       await test1()
       await test2()
       await test3()
       
       console.log('\n✅ All tests passed!')
       process.exit(0)  // Success
       
     } catch (error) {
       console.error('\n❌ Test failed:', error.message)
       console.error('Stack trace:', error.stack)
       process.exit(1)  // Failure
     }
   }
   
   runTests()
   ```

4. **Exit Codes Convention**
   - `0` = Success (everything worked)
   - `1` = General error (something went wrong)
   - `2` = Misuse (wrong arguments, etc.)
   - Other codes = Specific errors (optional)

### 📋 Script Exit Checklist:

```
□ Script has main function?
□ Main function is async?
□ Has try-catch block?
□ Has process.exit(0) on success?
□ Has process.exit(1) on error?
□ Logs error message before exit?
□ Logs success message before exit?
□ No hanging connections (DB, HTTP, etc.)?
```

**IF ANY ANSWER IS "NO" → FIX IT BEFORE RUNNING!**

### 🎯 WHEN TO USE process.exit():

**✅ ALWAYS use in:**
- Test scripts (test-*.js, test_*.py)
- Standalone scripts (migrate.js, seed.js, etc.)
- CLI tools (build.js, deploy.js, etc.)
- One-time runners (import-data.js, etc.)

**❌ NEVER use in:**
- Web servers (Express, FastAPI, etc.)
- Long-running services (workers, daemons, etc.)
- Library code (modules, packages, etc.)
- Middleware functions

### 🇹🇭 ตัวอย่างที่ดี:

```javascript
/**
 * FILE: test-phase2.js
 * PURPOSE: Test Phase 2 - Order & Payment Core Modules
 */

async function testPhase2() {
  console.log('='.repeat(80))
  console.log('PHASE 2 TEST')
  console.log('='.repeat(80))
  
  try {
    // Load config
    const config = loadConfig()
    
    // Run tests
    await testCreateOrder()
    await testListOrders()
    await testPaymentStatus()
    
    // Summary
    console.log('\n✅ All tests passed!')
    console.log('🎉 Phase 2 completed successfully!')
    
    process.exit(0)  // ← MUST HAVE!
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message)
    console.error('Stack trace:', error.stack)
    process.exit(1)  // ← MUST HAVE!
  }
}

testPhase2()
```

### 🇹🇭 ตัวอย่างที่แย่:

```javascript
// ❌ WRONG: No exit, script hangs
async function testPhase2() {
  try {
    await testCreateOrder()
    console.log('✅ Test passed!')
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

testPhase2()  // Will hang forever!
```

---

---

## 🛡️ RULE #8: FILE DELETION SAFETY (ห้ามลบไฟล์แบบถาวร!)

### ❌ FORBIDDEN:
- Using permanent deletion commands: `del`, `rm`, `rm -rf`, `Remove-Item`
- Deleting files without recovery option
- Losing data due to accidental deletion

### 🇹🇭 ทำไมต้องมี safety rule?

**ปัญหาที่เคยเจอ:**
- ลบไฟล์ผิด → ไม่สามารถกู้คืนได้
- ลบ node_modules แล้วต้องติดตั้งใหม่ (เสียเวลา)
- ลบ cache แล้วระบบพัง
- ไม่มีทางกู้คืน → ต้องสร้างใหม่ทั้งหมด

**วิธีแก้:**
- ใช้ Recycle Bin/Trash แทน
- ไฟล์ยังอยู่ → สามารถกู้คืนได้
- ปลอดภัยและสะดวก

### ✅ REQUIRED:

**WHENEVER deleting files or directories:**

1. **NEVER use permanent deletion:**
   ```powershell
   # ❌ WRONG: Permanent deletion
   del node_modules
   rm -rf build
   Remove-Item -Recurse -Force logs
   ```

2. **ALWAYS use Recycle Bin/Trash:**
   ```powershell
   # ✅ RIGHT: Move to Recycle Bin (safe)
   Add-Type -AssemblyName Microsoft.VisualBasic
   [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory("node_modules", 'OnlyErrorDialogs', 'SendToRecycleBin')
   ```

3. **If `trash-cli` is installed (Linux/Mac):**
   ```bash
   # ✅ RIGHT: Use trash command
   trash node_modules
   trash build
   trash logs
   ```

4. **PowerShell helper function (recommended):**
   ```powershell
   # Add to your profile or use directly
   function Remove-ToRecycleBin {
     param([string]$Path)
     
     if (-not (Test-Path $Path)) {
       Write-Error "Path not found: $Path"
       return
     }
     
     Add-Type -AssemblyName Microsoft.VisualBasic
     [Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory($Path, 'OnlyErrorDialogs', 'SendToRecycleBin')
     Write-Host "✅ Moved to Recycle Bin: $Path"
   }
   
   # Usage:
   Remove-ToRecycleBin "node_modules"
   Remove-ToRecycleBin "build"
   Remove-ToRecycleBin "logs"
   ```

### 📋 File Deletion Checklist:

```
□ Is this file/directory really needed to be deleted?
□ Do I have a backup?
□ Am I using Recycle Bin/Trash (not permanent deletion)?
□ Can I recover this if something goes wrong?
□ Did I double-check the path?
```

**IF ANY ANSWER IS "NO" → DON'T DELETE!**

### 🎯 WHEN TO DELETE:

**✅ SAFE to delete:**
- `node_modules/` (can reinstall with npm install)
- `.cache/` (can regenerate)
- `build/` (can rebuild)
- `dist/` (can rebuild)
- `*.log` (old logs)
- `.backup` files (after confirming backup is safe)

**❌ NEVER delete:**
- `src/` (source code!)
- `data/` (user data!)
- `config.json` (configuration!)
- `.git/` (version history!)
- `package.json` (dependencies!)
- Any file you're not 100% sure about

### 🇹🇪 EXAMPLE: Safe deletion

```powershell
# ❌ WRONG: Permanent deletion
del node_modules

# ✅ RIGHT: Move to Recycle Bin
Add-Type -AssemblyName Microsoft.VisualBasic
[Microsoft.VisualBasic.FileIO.FileSystem]::DeleteDirectory("node_modules", 'OnlyErrorDialogs', 'SendToRecycleBin')

# ✅ RIGHT: Using helper function
Remove-ToRecycleBin "node_modules"
```

### ⚠️ PRIORITY: HIGH

**This is a safety rule to prevent data loss. Do not ignore it.**

---

## 🎯 SUMMARY

### The 8 Iron Rules:

1. **NO THROWAWAY CODE** - Every file, every function must be used. No waste.
2. **MANDATORY FILE HEADERS** - Every file must have complete context. No confusion.
3. **PRODUCTION-GRADE ONLY** - Every line must be long-term quality. No shortcuts.
4. **SYSTEM INTEGRITY** - Every change must update ALL related code. No broken pipelines.
5. **COMPREHENSIVE DEBUG MODE** - Every decision must be debuggable. No blind training.
6. **MANDATORY README UPDATES** - Every task completion must update README. No outdated docs.
7. **MANDATORY PROCESS.EXIT()** - Every script must exit properly. No hanging processes.
8. **FILE DELETION SAFETY** - Always use Recycle Bin/Trash. Never permanent deletion.

### Remember:

- ✅ Quality over speed
- ✅ Long-term over short-term
- ✅ Maintainable over quick
- ✅ Production-ready over "good enough"
- ✅ Complete refactoring over partial fixes
- ✅ System integrity over quick patches
- ✅ README always up-to-date
- ✅ Scripts always exit properly

### When in Doubt:

1. Read the specs (design.md, tasks.md, requirements.md)
2. Check existing code
3. Follow the 7 rules
4. Map ALL dependencies before changing
5. Test ENTIRE pipeline after changing
6. Enable DEBUG_MODE to understand what's happening
7. Update README.md after completing task
8. Add process.exit() to all scripts
9. Ask for clarification

---

**THESE RULES ARE ABSOLUTE. NO EXCEPTIONS. NO COMPROMISES.**

**Last Updated:** 2026-01-16  
**Enforced By:** All AI agents working on this project  
**Violations:** Will result in code rejection and rework
