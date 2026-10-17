# 04. Reproduction & Experimentation Guide

> **Document ID**: `docs/04_reproduction_guide.md`  
> **Project**: BDD10K Active Learning Lab (Autonomous Driving Human-in-the-Loop Vision Engine)  
> **Author / Research Group**: T018  
> **Target Notebook**: `notebooks/07_end_to_end_autonomous_active_loop.ipynb`  
> **Official Repository**: `https://github.com/nguyenhuynhdt37/autonomous-driving-active-learning-lab.git`  
> **Status**: Production Verified / Evidence-Based  

---

## 1. Overview

### 1.1 Purpose of This Guide
This guide provides step-by-step instructions for researchers, computer vision engineers, and reviewers to independently reproduce, inspect, and customize the empirical results of the **BDD10K Active Learning Lab**. Specifically, it demonstrates how to execute and evaluate the closed-loop active learning pipeline implemented in `07_end_to_end_autonomous_active_loop.ipynb`.

### 1.2 Role of Notebook 07 in the Project
Notebook `07` is the master orchestration phase of the research suite. It synthesizes all previous standalone stages into a continuous, automated feedback loop:
- Ingests deduplicated frames from Phase 01 and 5D optical metadata from Phase 02.
- Enforces strict video sequence isolation to partition the dataset into four leak-free subsets.
- Deploys the **C4 Super-Fusion** active selection engine using class-deficit adaptive penalties ($W_i$).
- Simulates human-in-the-loop oracle verification with quality-gated ground truth lookups.
- Controls model iteration stops via a 5-tier dynamic stopping guard.
- Produces 300-DPI publication figures and execution manifests with zero metric fabrication.

### 1.3 What You Can Test
Depending on your objectives, you can:
- **Audit Pipeline Integrity**: Run the complete logic audit in seconds under `DRY_RUN = True` to verify video sequence isolation, manifest generation, stopping conditions, and cache cleanup.
- **Inspect Benchmark Baseline**: Load and verify the 10-class macro-average metrics ($mAP_{50}$, $mAP_{50:95}$, Precision, Recall, F1, CF-Score) of the Seed V0 model on the 1,400-image Frozen Gold Test set.
- **Regenerate Publication Figures**: Render high-resolution figures (Master Trajectory, 10-Class Radar, Slice Breakdown, and Stopping Dynamics) from verified experimental summaries.
- **Execute Production Retraining**: Disable dry-run mode (`DRY_RUN = False`) to trigger true YOLOv11n active learning cycles on Apple Silicon MPS or NVIDIA CUDA hardware.

### 1.4 Execution Modes: Option A vs. Option B
- **Option A (Run Existing Notebook)**: Ideal for fast inspection, logic verification, and paper result audits without changing codebase architecture.
- **Option B (Clone & Customize Repository)**: Designed for researchers wanting to modify hyperparameters ($K$, seed ratios, stopping thresholds), alter acquisition criteria, or retrain models on external datasets.

---

## 2. Option A — Run the Existing Notebook

Follow these steps to inspect and run the pre-configured notebook within the existing workspace.

### 2.1 File Location
The master notebook is located at:
```text
notebooks/07_end_to_end_autonomous_active_loop.ipynb
```
Internal project dependencies are resolved dynamically via `src/paths.py` relative to the project root directory.

### 2.2 Environment & Data Prerequisites
Before executing the notebook, ensure the following artifacts and environment dependencies are present:

1. **Python Environment**:
   - Python `3.9` or `3.10` with core packages: `torch>=2.0.0`, `torchvision>=0.15.0`, `ultralytics>=8.3.0`, `imagehash>=4.3.0`, `opencv-python>=4.8.0`, `scikit-learn>=1.3.0`, `scipy>=1.10.0`, `matplotlib>=3.7.0`, `pandas>=2.0.0`, `pyyaml>=6.0`.
2. **Phase 01 & Phase 02 Upstream Artifacts**:
   - `data/processed/unique_pool/`: Directory containing the 6,994 clean frame symlinks (0 KB disk footprint).
   - `data/processed/reports/data_profiling_manifest.json`: 5D optical and spatial profiling manifest for all 6,994 pool frames.
   - `data/bdd10k/bdd10k_metadata.json`: Original BDD10K ground-truth annotations (read-only reference).
3. **Phase 04 Baseline Tables** (for metric display):
   - `results/phase_07/tables/per_class_v0_baseline.json`: Ground truth baseline per-class metrics.
   - `results/phase_07/tables/per_class_iterations_summary.json`: Multi-round benchmark comparison data.

### 2.3 Opening the Notebook
Open the notebook using Jupyter Lab, classic Jupyter Notebook, or the VS Code Interactive Python extension:
```bash
# Activate the existing virtual environment
source .venv/bin/activate

# Launch Jupyter Lab from project root
jupyter lab notebooks/07_end_to_end_autonomous_active_loop.ipynb
```
*Note: Always ensure the working directory is the project root so `Path.cwd()` accurately identifies `src/` and `data/`.*

### 2.4 Sequential Execution Order (16 Cells)
Execute cells strictly in sequential order (1 through 16):

| Cell # | Type | Description & Operation | Expected Console / Visual Output |
| :---: | :---: | :--- | :--- |
| **0** | Markdown | Phase 07 master title and mathematical specifications | Formatted text header |
| **1** | Code | Initialize environment, auto-detect project root, configure device (`mps`/`cuda`/`cpu`), set `seed=42` | Paths printed; `Apple Silicon MPS Hardware Acceleration: ENABLED` (or CUDA/CPU) |
| **2** | Markdown | 12-Step pipeline architecture & budget allocation overview | Theoretical breakdown |
| **3** | Code | Ingest 6,994 unique pool symlinks and 5D profiling manifest | Counts printed for `is_night`, `is_small_slice`, `is_occluded`, `is_blur` |
| **4** | Code | Instantiate `AutonomousLoopConfig`, partition 4 subsets via `AutonomousLoopOrchestrator`, verify Zero Video Overlap | `🛡️ KIỂM TOÁN AN TOÀN ZERO VIDEO OVERLAP: PASSED (100% CÁCH LY TUYỆT ĐỐI)` |
| **5** | Markdown | C4 Super-Fusion selector and dynamic stopping guard rules | Mathematical formulation |
| **6** | Code | Execute full pipeline logic audit (`DRY_RUN = True`) | Iteration logs; `🏁 KẾT QUẢ THỰC THI HOÀN TẤT: [PASSED]` |
| **7** | Markdown | Specification of 10-class evaluation metrics (IEEE/APA standards) | Formatted section header |
| **8** | Code | Load and display 10-class APA/IEEE metric table of Seed V0 baseline | Formatted ASCII/Markdown table with all 6 metrics |
| **9** | Markdown | Description of four 300-DPI publication figures | Summary of Figures 07a to 07d |
| **10** | Code | Render & display **Figure 07a**: Active vs. Random trajectory | `figure_07a_active_learning_curve.png` rendered inline |
| **11** | Code | Render & display **Figure 07b**: 10-Class radar chart & net gains | `figure_07b_per_class_radar_and_gain.png` rendered inline |
| **12** | Code | Render & display **Figure 07c**: Hard slices mining breakdown ($K=250$) | `figure_07c_hard_slices_quota_evolution.png` rendered inline |
| **13** | Code | Render & display **Figure 07d**: Stopping guard dynamics & confirmation | `figure_07d_stopping_guard_delta_dynamics.png` rendered inline |
| **14** | Code | Audit Zero Stale Cache (`*.cache == 0`) and seal execution manifest | `🔒 KIỂM TOÁN ZERO STALE CACHE BDD10K: PASSED (100% READ-ONLY BẤT BIẾN)` |
| **15** | Markdown | Scientific conclusions, diminishing returns, and deployment findings | Analytical summary text |

### 2.5 Critical Parameters to Inspect Before Running
Review Cell 4 and Cell 6 before starting:
- **`DRY_RUN` in Cell 6**: Set to `True` by default. This executes the entire orchestration logic, validates assertions, checks split integrity, and tests the stopping guard without launching multi-hour model training.
- **`AutonomousLoopConfig` in Cell 4**:
  - `initial_unlabeled_ratio = 0.20`: 20% of the initial unlabeled bank allocated to Seed V0 (979 images).
  - `batch_size_k = 250`: Budget of $K=250$ frames selected per iteration.
  - `max_iterations = 5`: Up to 5 active iterations (V1 to V5).
  - `seed = 42`: Fixed seed for reproducible splits.

### 2.6 Expected Outputs & Artifacts
When Cell 14 finishes, the following artifacts are verified on disk:
- `results/phase_07/manifests/phase07_execution_manifest.json`: Detailed execution metadata including hardware device, timestamp, and seed counts.
- `results/phase_07/figures/`:
  - `figure_07a_active_learning_curve.png`
  - `figure_07b_per_class_radar_and_gain.png`
  - `figure_07c_hard_slices_quota_evolution.png`
  - `figure_07d_stopping_guard_delta_dynamics.png`

### 2.7 How to Verify a Successful Run
A successful run satisfies all three criteria:
1. **Assertion Integrity**: No `AssertionError` is raised in Cell 4 (Zero Video Overlap) or Cell 14 (Zero Stale Cache).
2. **Stopping Status**: The execution verdict output in Cell 6 reports:
   ```text
   • Trạng thái : [PASSED] (or TOURNAMENT_ALL_FRONT_VICTORY)
   • Thông điệp : All-front victory achieved. Early stopping confirmed.
   ```
3. **Zero Cache Leakage**: Cell 14 confirms `File cache rò rỉ trong data/bdd10k/: 0`.

### 2.8 Dependency Constraints
- If `data/processed/unique_pool` or `data/processed/reports/data_profiling_manifest.json` is missing, Cell 3 will fail with `FileNotFoundError`. Those files must be generated via Notebooks 01 and 02 first.
- The notebook relies on `src/` modules in the repository (`src.paths`, `src.autonomous_loop`, `src.utils`). Moving the notebook outside the `notebooks/` directory without updating `sys.path` will trigger `ModuleNotFoundError`.

---

## 3. Option B — Clone and Customize the Repository

Follow these instructions to clone the repository to an external workstation or server for deeper customization and parameter exploration.

### 3.1 Official Repository URL
- **HTTPS**: `https://github.com/nguyenhuynhdt37/autonomous-driving-active-learning-lab.git`
- **SSH**: `git@github.com:nguyenhuynhdt37/autonomous-driving-active-learning-lab.git`

### 3.2 Cloning the Repository
```bash
git clone https://github.com/nguyenhuynhdt37/autonomous-driving-active-learning-lab.git
cd autonomous-driving-active-learning-lab
```

### 3.3 Setting Up Development Environment
Create an isolated Python environment and install the exact verified dependencies:
```bash
# Create virtual environment
python3 -m venv .venv

# Activate environment
source .venv/bin/activate  # On Linux/macOS
# or: .venv\Scripts\activate  # On Windows

# Upgrade installer tools
pip install --upgrade pip setuptools wheel

# Install production requirements
pip install -r requirements.txt
```

Verify GPU / accelerator accessibility:
```bash
python3 -c "import torch; print('CUDA:', torch.cuda.is_available(), '| MPS:', torch.backends.mps.is_available())"
```

### 3.4 Creating an Experiment Branch & Notebook Copy
To preserve original results and track diffs cleanly, create a custom experiment branch and notebook copy:
```bash
# Create feature branch
git checkout -b experiment/custom-active-loop

# Copy master notebook
cp notebooks/07_end_to_end_autonomous_active_loop.ipynb notebooks/07_custom_active_loop.ipynb
```

### 3.5 Supported Customization Points
The architecture in `src/autonomous_loop.py` natively supports modifying the following configurations:

1. **Active Acquisition Budget ($K$)**:
   Modify `batch_size_k` in `AutonomousLoopConfig`:
   ```python
   config = AutonomousLoopConfig(
       batch_size_k=100,  # Finer-grained selection (default: 250)
       max_iterations=8,
   )
   ```
2. **Seed V0 Allocation Ratio**:
   Adjust `initial_unlabeled_ratio` (default `0.20` = 979 images; setting `0.10` creates an initial seed of 489 images).
3. **Early Stopping Sensitivity**:
   Adjust `delta_plateau_threshold` (default `0.3` percentage points of $mAP_{50}$) or `uncertainty_depleted_threshold` (default `0.15`).
4. **Hardware Selection**:
   Override `device="cpu"`, `device="cuda"`, or `device="mps"` instead of `"auto"`.
5. **Real Model Retraining Mode**:
   In Cell 6, toggle:
   ```python
   DRY_RUN = False
   ```
   *Warning: Setting `DRY_RUN = False` initiates actual YOLOv11n training for 20 epochs on V0, followed by 8 epochs per active loop iteration. Ensure a dedicated GPU is available.*

### 3.6 Storage, Checkpoints, and Runtime Considerations
- **Disk Usage**: Symlink-based splits consume **0 KB** disk storage for image copies. However, saving PyTorch weights during full training (`DRY_RUN = False`) produces `.pt` checkpoints of approximately 5.6 MB per round (stored in `runs/detect/`).
- **Runtime Expectations**:
  - `DRY_RUN = True`: ~15–30 seconds total on standard 8-core CPU or Apple Silicon.
  - `DRY_RUN = False`: ~45–90 minutes on Apple M-series (MPS) or NVIDIA RTX 3080/4090 (CUDA) across all 5 iterations.

---

## 4. What Can Be Tested?

Below is the verified matrix of experiments that can be evaluated directly using the existing codebase:

### Test 1: Full Pipeline Logic & Leakage Audit
- **Purpose**: Verify that data split partitioning, video sequence isolation, manifest generation, and cache clearing execute cleanly without errors.
- **Code to Modify**: Cell 6 (`DRY_RUN = True`).
- **Prerequisites**: Phase 01 (`unique_pool`) and Phase 02 (`data_profiling_manifest.json`) present on disk.
- **Observable Results**: Console confirmation of Zero Video Overlap, partition count verification, and creation of `phase07_execution_manifest.json`.
- **Comparison Method**: Compare split sample counts against expected totals: Fixed Test (1,400), Fixed Val (700), Seed V0 (979), Unlabeled Pool (3,915).
- **Scope Limitations**: Does not train model weights or update real test metrics.

### Test 2: Active Mining Batch Size Sensitivity ($K$)
- **Purpose**: Measure the effect of selection chunk size on pool longevity and candidate diversification.
- **Code to Modify**: Change `batch_size_k=250` in Cell 4 to `100` or `500`.
- **Prerequisites**: Existing environment setup.
- **Observable Results**: Total iterations to pool depletion will scale inversely with $K$; number of images added per iteration will reflect the new budget.
- **Comparison Method**: Compare total labeled images required to reach stopping conditions.
- **Scope Limitations**: Without full training (`DRY_RUN = False`), metric evolution per round cannot be compared dynamically.

### Test 3: Seed V0 Budget Ratio ($10\%$ vs. $20\%$)
- **Purpose**: Evaluate the impact of initial seed size on downstream acquisition efficiency.
- **Code to Modify**: Set `initial_unlabeled_ratio=0.10` (489 images) vs `0.20` (979 images) in `AutonomousLoopConfig`.
- **Prerequisites**: Standard repo setup.
- **Observable Results**: Size of Seed V0 and remaining pool partitions update immediately in Cell 4.
- **Comparison Method**: Compare data partition statistics in stdout.
- **Scope Limitations**: Real baseline $mAP_{50}$ drop on $10\%$ vs $20\%$ requires full retraining (`DRY_RUN = False`).

### Test 4: Dynamic Stopping Guard Sensitivity
- **Purpose**: Inspect the stopping guard logic when changing marginal gain tolerance.
- **Code to Modify**: Modify `delta_plateau_threshold=0.1` vs `delta_plateau_threshold=0.5` in `AutonomousLoopConfig`.
- **Prerequisites**: Notebook loaded.
- **Observable Results**: Changes the plateau detection trigger when delta gains flatten.
- **Comparison Method**: Compare the final iteration reported in `verdict.status`.
- **Scope Limitations**: Evaluated against historical iteration metric summaries unless full training is enabled.

### Test 5: End-to-End Real Model Training (`DRY_RUN = False`)
- **Purpose**: Execute live YOLOv11n training across all iterations to generate newly measured weights and evaluation metrics.
- **Code to Modify**: Set `DRY_RUN = False` in Cell 6.
- **Prerequisites**: NVIDIA GPU with CUDA or Apple Silicon Mac with MPS; minimum 16 GB unified/system RAM; raw BDD10K dataset images accessible.
- **Observable Results**: PyTorch training progress bars, validation metric outputs on 1,400 test images, newly generated `.pt` checkpoints.
- **Comparison Method**: Compare generated per-class $mAP_{50}$ against `results/phase_07/tables/per_class_iterations_summary.json`.
- **Scope Limitations**: Computationally intensive; non-deterministic floating-point math across different GPU architectures may introduce slight decimal variations ($\pm 0.1\text{--}0.3\%$).

### Test 6: Custom Visualization & Figure Re-styling
- **Purpose**: Adjust figure typography, color palettes, or resolution for academic publication.
- **Code to Modify**: Edit plotting parameters (`dpi=300`, colors, line styles) in Cells 10, 11, 12, and 13.
- **Prerequisites**: `matplotlib>=3.7.0` installed.
- **Observable Results**: Updated `.png` figures saved in `results/phase_07/figures/`.
- **Comparison Method**: Visual inspection against pre-rendered baseline figures.
- **Scope Limitations**: Purely visual; does not alter underlying data points.

---

## 5. Reproducing and Comparing Results

To ensure rigorous scientific comparison between runs:

### 5.1 Deterministic Configuration
- Always fix the random seed: `set_seed(42)` is called in Cell 1 and set in `AutonomousLoopConfig(seed=42)`.
- Use the same Python package versions recorded in `requirements.txt`.

### 5.2 Recording Run Metadata
When Cell 14 runs, it serializes run configurations into `phase07_execution_manifest.json`. When conducting custom trials, rename or archive this manifest alongside your modified configuration:
```bash
cp results/phase_07/manifests/phase07_execution_manifest.json \
   results/phase_07/manifests/manifest_experiment_k100.json
```

### 5.3 Benchmark Dataset Invariance
- **Ground Truth Benchmark**: All evaluations must be performed exclusively on the **1,400-image Frozen Gold Test set** materialized in `data/splits/autonomous_loop/fixed_test/`.
- **No Evaluation on Pool**: Never compute final evaluation metrics on unlabeled pool candidates or training splits.
- **Zero Video Overlap**: Verify that video IDs in `test`, `val`, and `bank` never intersect.

### 5.4 Understanding Variance & Discrepancies
When retraining models (`DRY_RUN = False`), small numerical differences from published metrics may arise due to:
- **Hardware Acceleration Differences**: PyTorch atomic operations on Apple Silicon MPS vs. NVIDIA CUDA kernels.
- **PyTorch / Torchvision Minor Versions**: Slight differences in data augmentation implementations between versions.
- **Thread Scheduling**: Multi-threaded DataLoader operations during training.

Any divergence within $\pm 0.35\%$ $mAP_{50}$ falls within expected GPU stochastic tolerance.

---

## 6. Troubleshooting

Common issues and their verified remedies:

### 6.1 `RuntimeError: Không tìm thấy thư mục gốc dự án chứa src/ và data/!`
- **Cause**: Notebook working directory is not the repository root or parent directories do not contain `src/` and `data/`.
- **Remedy**: Ensure you launch Jupyter from the project root directory. If running in a subfolder, add the root directory path manually:
  ```python
  import sys
  from pathlib import Path
  sys.path.insert(0, str(Path("/path/to/autonomous-driving-active-learning-lab").resolve()))
  ```

### 6.2 `FileNotFoundError: data/processed/unique_pool`
- **Cause**: Phase 01 deduplication has not been executed, or symbolic links have been deleted.
- **Remedy**: Verify Phase 01 artifacts exist. If missing, run Notebook `01_dual_stream_fastdedup_benchmark.ipynb` or restore the processed data folder.

### 6.3 `AssertionError: Lỗi rò rỉ video giữa test và val!`
- **Cause**: Frame filenames have been altered or modified without standard BDD10K prefix naming convention (`<video_id>-<frame_id>.jpg`).
- **Remedy**: Verify that image files in `unique_pool` retain original BDD10K naming conventions so that `name.split("-")[0]` correctly isolates video sequences.

### 6.4 `AssertionError: Phát hiện X cache rò rỉ vào data/bdd10k/!`
- **Cause**: Ultralytics YOLOv11n automatically creates `*.cache` files in dataset folders during dataset inspection.
- **Remedy**: Run Cell 14 or invoke `clean_all_caches()` from `src.autonomous_loop`. This removes all temporary `.cache` files to maintain read-only dataset invariance.

### 6.5 Out of Memory (OOM) on MPS or CUDA
- **Cause**: GPU VRAM exhaustion when `DRY_RUN = False` with `batch_size=16` at `imgsz=640`.
- **Remedy**: Reduce batch size in Cell 4:
  ```python
  config = AutonomousLoopConfig(
      batch_size=8,  # Reduced from 16
      imgsz=640,
  )
  ```

---

## 7. Limitations

1. **Upstream Artifact Dependency**: Notebook 07 is not an end-to-end data ingester from zero; it strictly requires the deduplicated pool from Phase 01 and 5D optical profiling from Phase 02.
2. **Computational Constraints of Live Retraining**: Running complete active loops with real training (`DRY_RUN = False`) across multiple iterations is infeasible on standard consumer CPU setups. A hardware accelerator (Apple Silicon with MPS or NVIDIA GPU with $\ge 8$ GB VRAM) is required.
3. **Logic Audit vs. Empirical Retraining**: Executing `DRY_RUN = True` verifies algorithmic logic, split materialization, and stopping conditions, but does not train weights or establish new empirical milestones.
4. **Algorithmic Extensibility**: Adding novel acquisition functions (e.g., CoreSet, Badge, or Bayesian Active Learning) requires extending the `ActiveMiningSelector` class in `src/autonomous_loop.py`; it cannot be achieved solely through notebook parameters.

---

## 8. Related Documentation

- [`docs/01_project_overview.md`](01_project_overview.md): High-level research motivation, data-centric paradox, and project objectives.
- [`docs/02_pipeline_architecture.md`](02_pipeline_architecture.md): Detailed 12-step pipeline architecture, mathematical formulations, and data flow specifications.
- [`docs/03_experiment_results.md`](03_experiment_results.md): Comprehensive quantitative benchmark results, 10-class breakdown, and evidence audit.
- [`docs/05_limitations_and_future_work.md`](05_limitations_and_future_work.md): Theoretical boundaries, current engineering limits, and research roadmap.
- [`docs/README.md`](README.md): Index and structural overview of all technical documentation.
- [`README.md`](../README.md): Master simulator portal and interactive demonstration interface.
