"""
A/B Testing – StressGuard Intervention Effectiveness
=====================================================
Coding Camp 2026 · DBS Foundation · Kelompok: Dimas, Izzah, Enuh, Pratama

Tujuan:
    Menguji apakah intervensi rekomendasi berbasis segmen (Grup B)
    secara statistik terbukti menurunkan tingkat stres pengguna
    dibandingkan kontrol tanpa intervensi (Grup A).

Skenario:
    - Grup A (Kontrol)  : tidak mendapat rekomendasi apapun.
    - Grup B (Treatment): mendapat rekomendasi personal berbasis
      segmen risiko stres.

Metrik utama:
    - Rata-rata stress_level setelah 14 hari
    - Proporsi pengguna yang turun ke kategori yang lebih rendah
      (High → Medium / Low, Medium → Low)

Uji statistik:
    - Mann-Whitney U Test  : perbedaan median stress_level
    - Chi-Square Test      : perbedaan proporsi penurunan kategori
    - Cohen's d            : effect size perbedaan rata-rata
    - Bootstrap 95% CI     : interval kepercayaan perbedaan mean
"""

import os
import math
import json
import warnings
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")          # headless render untuk simpan gambar
import matplotlib.pyplot as plt
import seaborn as sns

from scipy import stats
from scipy.stats import mannwhitneyu, chi2_contingency
from typing import Tuple, Dict

warnings.filterwarnings("ignore")

np.random.seed(42)
sns.set_theme(style="whitegrid")
OUTPUT_DIR = "ab_test_outputs"
os.makedirs(OUTPUT_DIR, exist_ok=True)

PALETTE = {"Kontrol (A)": "#3498db", "Treatment (B)": "#e74c3c"}

# ─── 1. Simulasi data pre-post ────────────────────────────────────────────────

def simulate_ab_data(
    n_per_group: int = 500,
    base_stress_mean: float = 7.2,
    base_stress_std: float = 1.8,
    treatment_effect: float = -1.4,
    noise_std: float = 0.9,
) -> pd.DataFrame:
    """
    Simulasi data A/B test dengan distribusi stress_level pre dan post.
    Data disimulasikan mengikuti distribusi yang realistis berdasarkan
    karakteristik dataset asli (mean ≈ 7, std ≈ 2, range 1-10).
    """
    # Pre-test: kedua grup mulai dari kondisi yang sama
    stress_pre_a = np.clip(
        np.random.normal(base_stress_mean, base_stress_std, n_per_group), 1, 10
    )
    stress_pre_b = np.clip(
        np.random.normal(base_stress_mean, base_stress_std, n_per_group), 1, 10
    )

    # Post-test: grup A tidak berubah banyak (natural drift kecil)
    stress_post_a = np.clip(
        stress_pre_a + np.random.normal(-0.2, noise_std, n_per_group), 1, 10
    )

    # Post-test: grup B turun karena intervensi
    stress_post_b = np.clip(
        stress_pre_b + np.random.normal(treatment_effect, noise_std, n_per_group), 1, 10
    )

    def to_category(arr):
        return pd.cut(
            arr,
            bins=[0, 3.99, 6.99, 10],
            labels=["Low", "Medium", "High"],
            include_lowest=True,
        )

    df = pd.DataFrame(
        {
            "user_id": range(1, 2 * n_per_group + 1),
            "group": ["Kontrol (A)"] * n_per_group + ["Treatment (B)"] * n_per_group,
            "stress_pre": np.concatenate([stress_pre_a, stress_pre_b]),
            "stress_post": np.concatenate([stress_post_a, stress_post_b]),
        }
    )

    df["stress_cat_pre"] = to_category(df["stress_pre"])
    df["stress_cat_post"] = to_category(df["stress_post"])
    df["stress_delta"] = df["stress_post"] - df["stress_pre"]

    # Apakah kategori stres turun?
    order_map = {"Low": 0, "Medium": 1, "High": 2}
    df["pre_ord"] = df["stress_cat_pre"].map(order_map)
    df["post_ord"] = df["stress_cat_post"].map(order_map)
    df["category_improved"] = (df["post_ord"] < df["pre_ord"]).astype(int)

    return df


# ─── 2. Fungsi statistik ──────────────────────────────────────────────────────

def cohens_d(a: np.ndarray, b: np.ndarray) -> float:
    """Cohen's d untuk dua sampel independen."""
    n_a, n_b = len(a), len(b)
    pooled_std = math.sqrt(
        ((n_a - 1) * a.std(ddof=1) ** 2 + (n_b - 1) * b.std(ddof=1) ** 2)
        / (n_a + n_b - 2)
    )
    return (a.mean() - b.mean()) / pooled_std if pooled_std != 0 else 0.0


def bootstrap_ci(
    a: np.ndarray,
    b: np.ndarray,
    n_boot: int = 10_000,
    ci: float = 0.95,
) -> Tuple[float, float]:
    """Bootstrap CI untuk perbedaan rata-rata (mean_A - mean_B)."""
    diffs = np.empty(n_boot)
    for i in range(n_boot):
        diffs[i] = (
            np.random.choice(a, len(a), replace=True).mean()
            - np.random.choice(b, len(b), replace=True).mean()
        )
    lo = np.percentile(diffs, (1 - ci) / 2 * 100)
    hi = np.percentile(diffs, (1 + ci) / 2 * 100)
    return lo, hi


def interpret_effect_size(d: float) -> str:
    d_abs = abs(d)
    if d_abs < 0.2:
        return "sangat kecil"
    if d_abs < 0.5:
        return "kecil"
    if d_abs < 0.8:
        return "sedang"
    return "besar"


# ─── 3. Analisis utama ────────────────────────────────────────────────────────

def run_ab_analysis(df: pd.DataFrame) -> Dict:
    group_a = df[df["group"] == "Kontrol (A)"]
    group_b = df[df["group"] == "Treatment (B)"]

    post_a = group_a["stress_post"].values
    post_b = group_b["stress_post"].values

    # Mann-Whitney U
    mw_stat, mw_p = mannwhitneyu(post_a, post_b, alternative="greater")

    # Cohen's d
    d = cohens_d(post_a, post_b)

    # Bootstrap CI
    ci_lo, ci_hi = bootstrap_ci(post_a, post_b)

    # Chi-Square (proporsi category_improved)
    ct = pd.crosstab(df["group"], df["category_improved"])
    chi_stat, chi_p, chi_dof, _ = chi2_contingency(ct)

    results = {
        "n_kontrol": len(group_a),
        "n_treatment": len(group_b),
        "mean_post_a": round(post_a.mean(), 4),
        "mean_post_b": round(post_b.mean(), 4),
        "median_post_a": round(np.median(post_a), 4),
        "median_post_b": round(np.median(post_b), 4),
        "delta_mean": round(post_a.mean() - post_b.mean(), 4),
        "mann_whitney_stat": round(mw_stat, 4),
        "mann_whitney_p": round(mw_p, 6),
        "cohens_d": round(d, 4),
        "effect_size_label": interpret_effect_size(d),
        "bootstrap_ci_95_lo": round(ci_lo, 4),
        "bootstrap_ci_95_hi": round(ci_hi, 4),
        "chi2_stat": round(chi_stat, 4),
        "chi2_p": round(chi_p, 6),
        "chi2_dof": chi_dof,
        "improved_rate_a": round(group_a["category_improved"].mean() * 100, 2),
        "improved_rate_b": round(group_b["category_improved"].mean() * 100, 2),
    }
    return results


# ─── 4. Visualisasi ───────────────────────────────────────────────────────────

def plot_results(df: pd.DataFrame, results: Dict) -> None:
    fig = plt.figure(figsize=(16, 12))
    gs = fig.add_gridspec(2, 3, hspace=0.45, wspace=0.35)

    # ── 4a. Distribusi stress_post
    ax1 = fig.add_subplot(gs[0, 0])
    for grp, col in PALETTE.items():
        subset = df[df["group"] == grp]["stress_post"]
        ax1.hist(subset, bins=20, alpha=0.65, label=grp, color=col, edgecolor="white")
    ax1.axvline(results["mean_post_a"], color=PALETTE["Kontrol (A)"], lw=2, ls="--")
    ax1.axvline(results["mean_post_b"], color=PALETTE["Treatment (B)"], lw=2, ls="--")
    ax1.set_title("Distribusi Stress Level (Post-Test)")
    ax1.set_xlabel("Stress Level")
    ax1.set_ylabel("Frekuensi")
    ax1.legend(fontsize=8)
    sns.despine(ax=ax1)

    # ── 4b. Boxplot pre vs post
    ax2 = fig.add_subplot(gs[0, 1])
    melt = df.melt(
        id_vars="group",
        value_vars=["stress_pre", "stress_post"],
        var_name="phase",
        value_name="stress",
    )
    melt["phase"] = melt["phase"].map({"stress_pre": "Pre-Test", "stress_post": "Post-Test"})
    sns.boxplot(
        data=melt, x="phase", y="stress", hue="group",
        palette=PALETTE, ax=ax2, linewidth=0.8,
    )
    ax2.set_title("Pre vs Post Stress Level")
    ax2.set_xlabel("")
    ax2.set_ylabel("Stress Level")
    ax2.legend(fontsize=7, title="Grup", title_fontsize=7)
    sns.despine(ax=ax2)

    # ── 4c. Proporsi peningkatan kategori
    ax3 = fig.add_subplot(gs[0, 2])
    imp_df = pd.DataFrame(
        {
            "Grup": ["Kontrol (A)", "Treatment (B)"],
            "Improved (%)": [results["improved_rate_a"], results["improved_rate_b"]],
        }
    )
    bars = ax3.bar(
        imp_df["Grup"], imp_df["Improved (%)"],
        color=[PALETTE["Kontrol (A)"], PALETTE["Treatment (B)"]],
        edgecolor="white", linewidth=1.2,
    )
    for bar in bars:
        ax3.text(
            bar.get_x() + bar.get_width() / 2,
            bar.get_height() + 0.5,
            f"{bar.get_height():.1f}%",
            ha="center", fontsize=10, fontweight="bold",
        )
    ax3.set_title("Proporsi Penurunan Kategori Stres")
    ax3.set_ylabel("Persentase Pengguna (%)")
    ax3.set_ylim(0, 100)
    sns.despine(ax=ax3)

    # ── 4d. Bootstrap CI
    ax4 = fig.add_subplot(gs[1, 0])
    ci_center = results["delta_mean"]
    ci_lo = results["bootstrap_ci_95_lo"]
    ci_hi = results["bootstrap_ci_95_hi"]
    ax4.errorbar(
        x=[ci_center], y=[0],
        xerr=[[ci_center - ci_lo], [ci_hi - ci_center]],
        fmt="o", color="#2c3e50", capsize=8, capthick=2, elinewidth=2, markersize=10,
    )
    ax4.axvline(0, color="red", ls="--", lw=1.5, label="H0: Δ = 0")
    ax4.set_xlabel("Perbedaan Rata-rata Stress (A − B)")
    ax4.set_title("Bootstrap 95% CI – Perbedaan Mean Stress")
    ax4.set_yticks([])
    ax4.legend(fontsize=9)
    sns.despine(ax=ax4, left=True)

    # ── 4e. Delta distribusi
    ax5 = fig.add_subplot(gs[1, 1])
    for grp, col in PALETTE.items():
        subset = df[df["group"] == grp]["stress_delta"]
        ax5.hist(subset, bins=25, alpha=0.65, label=grp, color=col, edgecolor="white")
    ax5.axvline(0, color="black", ls="--", lw=1.5)
    ax5.set_title("Distribusi Perubahan Stress Level (Δ)")
    ax5.set_xlabel("Stress Post − Stress Pre")
    ax5.set_ylabel("Frekuensi")
    ax5.legend(fontsize=8)
    sns.despine(ax=ax5)

    # ── 4f. Ringkasan statistik sebagai teks
    ax6 = fig.add_subplot(gs[1, 2])
    ax6.axis("off")
    summary_text = (
        f"  RINGKASAN A/B TEST\n"
        f"  {'─' * 32}\n"
        f"  N Kontrol (A)    : {results['n_kontrol']:,}\n"
        f"  N Treatment (B)  : {results['n_treatment']:,}\n\n"
        f"  Mean stress A    : {results['mean_post_a']:.2f}\n"
        f"  Mean stress B    : {results['mean_post_b']:.2f}\n"
        f"  Δ Mean (A − B)   : {results['delta_mean']:.2f}\n\n"
        f"  Mann-Whitney U\n"
        f"    Statistik      : {results['mann_whitney_stat']:,.0f}\n"
        f"    p-value        : {results['mann_whitney_p']:.4f}\n"
        f"    Signifikan?    : {'✅ Ya (α=0.05)' if results['mann_whitney_p'] < 0.05 else '❌ Tidak'}\n\n"
        f"  Cohen's d        : {results['cohens_d']:.3f} ({results['effect_size_label']})\n"
        f"  Bootstrap 95% CI : [{results['bootstrap_ci_95_lo']:.2f}, {results['bootstrap_ci_95_hi']:.2f}]\n\n"
        f"  Chi-Square (kategori)\n"
        f"    Statistik      : {results['chi2_stat']:.2f}\n"
        f"    p-value        : {results['chi2_p']:.4f}\n"
        f"    Signifikan?    : {'✅ Ya (α=0.05)' if results['chi2_p'] < 0.05 else '❌ Tidak'}\n\n"
        f"  Improve rate A   : {results['improved_rate_a']:.1f}%\n"
        f"  Improve rate B   : {results['improved_rate_b']:.1f}%\n"
    )
    ax6.text(
        0.05, 0.95, summary_text,
        transform=ax6.transAxes,
        verticalalignment="top",
        fontfamily="monospace",
        fontsize=8.5,
        bbox=dict(boxstyle="round,pad=0.5", facecolor="#f0f4f8", edgecolor="#bdc3c7"),
    )

    fig.suptitle(
        "StressGuard – A/B Testing: Efektivitas Intervensi Rekomendasi Berbasis Segmen",
        fontsize=14, fontweight="bold", y=1.01,
    )
    plt.savefig(
        f"{OUTPUT_DIR}/ab_test_visualization.png",
        dpi=150, bbox_inches="tight", facecolor="white",
    )
    plt.close()
    print(f"  Visualisasi disimpan ke: {OUTPUT_DIR}/ab_test_visualization.png")


# ─── 5. Laporan teks ──────────────────────────────────────────────────────────

def print_report(results: Dict) -> None:
    sep = "=" * 60
    print(f"\n{sep}")
    print("  LAPORAN LENGKAP A/B TEST – STRESSGUARD")
    print(f"{sep}")

    print("\n[ DESKRIPSI EKSPERIMEN ]")
    print("  Hipotesis H₀ : Tidak ada perbedaan tingkat stres antara")
    print("                  grup kontrol dan grup treatment.")
    print("  Hipotesis H₁ : Grup treatment memiliki tingkat stres")
    print("                  lebih rendah setelah intervensi.")
    print(f"  Alpha         : 0.05")
    print(f"  N Kontrol (A) : {results['n_kontrol']:,}")
    print(f"  N Treatment(B): {results['n_treatment']:,}")

    print("\n[ STATISTIK DESKRIPTIF – POST-TEST ]")
    print(f"  Mean  stress – Kontrol (A)  : {results['mean_post_a']:.2f}")
    print(f"  Mean  stress – Treatment(B) : {results['mean_post_b']:.2f}")
    print(f"  Median stress – Kontrol (A) : {results['median_post_a']:.2f}")
    print(f"  Median stress – Treatment(B): {results['median_post_b']:.2f}")
    print(f"  Selisih mean (A − B)        : {results['delta_mean']:.2f}")

    print("\n[ UJI MANN-WHITNEY U ]")
    print(f"  Statistik U : {results['mann_whitney_stat']:,.0f}")
    print(f"  p-value     : {results['mann_whitney_p']:.6f}")
    sig = "DITOLAK" if results["mann_whitney_p"] < 0.05 else "TIDAK DITOLAK"
    print(f"  H₀          : {sig} (α = 0.05)")

    print("\n[ EFFECT SIZE – COHEN'S D ]")
    print(f"  d           : {results['cohens_d']:.4f}")
    print(f"  Kategori    : {results['effect_size_label'].upper()}")

    print("\n[ BOOTSTRAP 95% CI – PERBEDAAN MEAN (A − B) ]")
    print(f"  CI          : [{results['bootstrap_ci_95_lo']:.4f}, {results['bootstrap_ci_95_hi']:.4f}]")
    outside_zero = (
        results["bootstrap_ci_95_lo"] > 0 or results["bootstrap_ci_95_hi"] < 0
    )
    print(f"  Nol (0) di luar CI: {'Ya – perbedaan signifikan' if outside_zero else 'Tidak – perbedaan tidak signifikan'}")

    print("\n[ CHI-SQUARE TEST – PROPORSI PENURUNAN KATEGORI STRES ]")
    print(f"  Statistik χ² : {results['chi2_stat']:.4f}")
    print(f"  p-value      : {results['chi2_p']:.6f}")
    print(f"  df           : {results['chi2_dof']}")
    sig_chi = "DITOLAK" if results["chi2_p"] < 0.05 else "TIDAK DITOLAK"
    print(f"  H₀           : {sig_chi} (α = 0.05)")
    print(f"  Improve rate Kontrol (A)  : {results['improved_rate_a']:.1f}%")
    print(f"  Improve rate Treatment (B): {results['improved_rate_b']:.1f}%")

    print("\n[ KESIMPULAN ]")
    if results["mann_whitney_p"] < 0.05 and results["chi2_p"] < 0.05:
        print(
            "  Intervensi rekomendasi berbasis segmen (Grup B) terbukti secara\n"
            "  statistik menurunkan tingkat stres pengguna dibandingkan kontrol.\n"
            f"  Effect size Cohen's d = {results['cohens_d']:.3f} ({results['effect_size_label']}),\n"
            "  dan proporsi pengguna yang kategori stresnya membaik lebih tinggi\n"
            f"  secara signifikan ({results['improved_rate_b']:.1f}% vs {results['improved_rate_a']:.1f}%)."
        )
    else:
        print(
            "  Hasil tidak menunjukkan perbedaan yang signifikan secara statistik.\n"
            "  Rekomendasikan uji lanjutan dengan sampel lebih besar atau durasi lebih panjang."
        )

    print(f"\n{sep}\n")


# ─── 6. Ekspor hasil ──────────────────────────────────────────────────────────

def export_results(df: pd.DataFrame, results: Dict) -> None:
    df.to_csv(f"{OUTPUT_DIR}/ab_test_data.csv", index=False)
    with open(f"{OUTPUT_DIR}/ab_test_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=4, ensure_ascii=False)
    print(f"  Data  disimpan ke: {OUTPUT_DIR}/ab_test_data.csv")
    print(f"  Hasil disimpan ke: {OUTPUT_DIR}/ab_test_results.json")


# ─── 7. Main ──────────────────────────────────────────────────────────────────

def main():
    print("\n=== StressGuard – A/B Testing Pipeline ===\n")

    print("[1/4] Menyiapkan data simulasi...")
    df = simulate_ab_data(n_per_group=500)
    print(f"      Total sampel: {len(df):,} ({df['group'].value_counts().to_dict()})")

    print("\n[2/4] Menjalankan analisis statistik...")
    results = run_ab_analysis(df)

    print("\n[3/4] Membuat visualisasi...")
    plot_results(df, results)

    print("\n[4/4] Mengekspor hasil...")
    export_results(df, results)

    print_report(results)
    print("A/B Testing selesai.\n")


if __name__ == "__main__":
    main()
