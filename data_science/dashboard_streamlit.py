import streamlit as st
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import matplotlib.patches as mpatches
from matplotlib.gridspec import GridSpec
import warnings
warnings.filterwarnings('ignore')

# ─── Konfigurasi halaman ───────────────────────────────────────────────────────
st.set_page_config(
    page_title="StressGuard – Deteksi Dini Stres",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ─── Warna & tema ─────────────────────────────────────────────────────────────
PALETTE = {
    "low": "#2ecc71",
    "medium": "#f39c12",
    "high": "#e74c3c",
    "primary": "#2c3e50",
    "secondary": "#3498db",
    "bg": "#f8f9fa",
}
sns.set_theme(style="whitegrid", palette="muted")


# ─── Utility ──────────────────────────────────────────────────────────────────
@st.cache_data(show_spinner="Memuat dataset...")
def load_data(url: str) -> pd.DataFrame:
    df = pd.read_csv(url)
    rename_map = {"sleep_duration_hours": "sleep_hours"}
    df.rename(columns=rename_map, inplace=True)

    # stress_category
    bins   = [0, 3.99, 6.99, 10]
    labels = ["Low", "Medium", "High"]
    df["stress_category"] = pd.cut(
        df["stress_level"], bins=bins, labels=labels, include_lowest=True
    )

    # sleep_duration_category
    df["sleep_duration_category"] = pd.cut(
        df["sleep_hours"],
        bins=[0, 5.99, 7.99, 100],
        labels=["short", "ideal", "long"],
    )

    # sleep_quality_category
    df["sleep_quality_category"] = pd.cut(
        df["sleep_quality_score"],
        bins=[0, 4.99, 7.49, 10],
        labels=["poor", "average", "good"],
    )

    # phone_usage_before_sleep_category
    df["phone_usage_before_sleep_category"] = pd.cut(
        df["phone_usage_before_sleep_minutes"],
        bins=[-1, 30, 60, 9999],
        labels=["low", "moderate", "high"],
    )

    # daily_screen_time_category
    df["daily_screen_time_category"] = pd.cut(
        df["daily_screen_time_hours"],
        bins=[-1, 4, 7, 9999],
        labels=["low", "moderate", "high"],
    )

    # fitur interaksi
    df["poor_quality_and_short_sleep"] = (
        (df["sleep_quality_category"] == "poor") &
        (df["sleep_hours"] < 6)
    ).astype(int)

    df["high_phone_usage_low_sleep"] = (
        (df["phone_usage_before_sleep_category"] == "high") &
        (df["sleep_hours"] < 6)
    ).astype(int)

    df["sleep_deficit_hours"] = (7 - df["sleep_hours"]).clip(lower=0)

    # priority_segment
    def _segment(row):
        hs = row["daily_screen_time_category"] == "high"
        lq = row["sleep_quality_category"] == "poor"
        if hs and lq:
            return "high_screen_low_sleep_quality"
        if hs:
            return "high_screen_time"
        if lq:
            return "low_sleep_quality"
        return "general_users"

    df["priority_segment"] = df.apply(_segment, axis=1)

    if "user_id" in df.columns:
        df.drop(columns=["user_id"], inplace=True)

    return df


DATA_URL = (
    "https://raw.githubusercontent.com/ijlalsenja/stressguard/refs/heads/main"
    "/data_science/Dataset%203%20-%20sleep_mobile_stress_dataset_15000.csv"
)

df = load_data(DATA_URL)


# ─── Sidebar filter ───────────────────────────────────────────────────────────
with st.sidebar:
    st.image(
        "https://img.icons8.com/fluency/96/brain.png", width=80
    )
    st.title("🧠 StressGuard")
    st.caption("Deteksi Dini Stres · Coding Camp 2026 DBS Foundation")

    st.markdown("---")
    st.subheader("🔍 Filter Data")

    gender_opts = ["Semua"] + sorted(df["gender"].dropna().unique().tolist())
    sel_gender = st.selectbox("Jenis Kelamin", gender_opts)

    occ_opts = ["Semua"] + sorted(df["occupation"].dropna().unique().tolist())
    sel_occ = st.selectbox("Pekerjaan", occ_opts)

    age_range = st.slider(
        "Rentang Usia",
        int(df["age"].min()),
        int(df["age"].max()),
        (int(df["age"].min()), int(df["age"].max())),
    )

    stress_filter = st.multiselect(
        "Kategori Stres",
        ["Low", "Medium", "High"],
        default=["Low", "Medium", "High"],
    )

    st.markdown("---")
    st.caption("Tim: Dimas · Izzah · Enuh · Pratama")


# Terapkan filter
fdf = df.copy()
if sel_gender != "Semua":
    fdf = fdf[fdf["gender"] == sel_gender]
if sel_occ != "Semua":
    fdf = fdf[fdf["occupation"] == sel_occ]
fdf = fdf[fdf["age"].between(age_range[0], age_range[1])]
fdf = fdf[fdf["stress_category"].isin(stress_filter)]


# ─── Tabs ─────────────────────────────────────────────────────────────────────
tab_overview, tab_eda, tab_segment, tab_predict, tab_insights = st.tabs(
    ["Ringkasan", "📈 EDA", "🎯 Segmentasi", "🤖 Prediksi", "💡 Insight & Rekomendasi"]
)


# ════════════════════════════════════════════════════════════════════════════════
#  TAB 1 · RINGKASAN
# ════════════════════════════════════════════════════════════════════════════════
with tab_overview:
    st.header("Ringkasan Dataset")

    c1, c2, c3, c4 = st.columns(4)
    high_pct = (fdf["stress_category"] == "High").mean() * 100
    avg_sleep = fdf["sleep_hours"].mean()
    avg_screen = fdf["daily_screen_time_hours"].mean()
    n_users = len(fdf)

    c1.metric("Total Pengguna", f"{n_users:,}")
    c2.metric("High Stress Rate", f"{high_pct:.1f}%", delta=f"{high_pct - 33:.1f}% vs rata-rata")
    c3.metric("Rata-rata Tidur", f"{avg_sleep:.1f} jam")
    c4.metric("Rata-rata Screen Time", f"{avg_screen:.1f} jam/hari")

    st.markdown("---")

    col_a, col_b = st.columns(2)

    with col_a:
        st.subheader("Distribusi Kategori Stres")
        cat_counts = fdf["stress_category"].value_counts().reindex(["Low", "Medium", "High"])
        colors = [PALETTE["low"], PALETTE["medium"], PALETTE["high"]]
        fig, ax = plt.subplots(figsize=(5, 4))
        bars = ax.bar(cat_counts.index, cat_counts.values, color=colors, edgecolor="white", linewidth=1.2)
        for bar in bars:
            ax.text(
                bar.get_x() + bar.get_width() / 2,
                bar.get_height() + 50,
                f"{bar.get_height():,}",
                ha="center", va="bottom", fontsize=10, fontweight="bold",
            )
        ax.set_xlabel("Kategori Stres")
        ax.set_ylabel("Jumlah Pengguna")
        ax.set_title("Distribusi Tingkat Stres")
        sns.despine()
        st.pyplot(fig)
        plt.close()

    with col_b:
        st.subheader("Stres berdasarkan Gender")
        if fdf["gender"].nunique() > 0:
            gender_stress = (
                fdf.groupby(["gender", "stress_category"])
                .size()
                .reset_index(name="count")
            )
            pivot = gender_stress.pivot(index="gender", columns="stress_category", values="count").fillna(0)
            pivot = pivot.reindex(columns=["Low", "Medium", "High"], fill_value=0)
            fig2, ax2 = plt.subplots(figsize=(5, 4))
            pivot.plot(
                kind="bar",
                ax=ax2,
                color=[PALETTE["low"], PALETTE["medium"], PALETTE["high"]],
                edgecolor="white",
                linewidth=0.8,
            )
            ax2.set_xlabel("Gender")
            ax2.set_ylabel("Jumlah")
            ax2.set_title("Distribusi Stres per Gender")
            ax2.legend(title="Kategori Stres")
            ax2.tick_params(axis="x", rotation=0)
            sns.despine()
            st.pyplot(fig2)
            plt.close()

    st.markdown("---")
    st.subheader("Korelasi Fitur Numerik")
    num_cols = [
        "age", "daily_screen_time_hours", "phone_usage_before_sleep_minutes",
        "sleep_hours", "sleep_quality_score", "stress_level",
        "caffeine_intake_cups", "physical_activity_minutes",
        "notifications_received_per_day", "mental_fatigue_score",
    ]
    num_cols = [c for c in num_cols if c in fdf.columns]
    corr = fdf[num_cols].corr()
    fig3, ax3 = plt.subplots(figsize=(10, 7))
    mask = np.triu(np.ones_like(corr, dtype=bool))
    sns.heatmap(
        corr, mask=mask, annot=True, fmt=".2f", cmap="RdYlGn",
        center=0, square=True, linewidths=0.5, ax=ax3, annot_kws={"size": 8},
    )
    ax3.set_title("Heatmap Korelasi Fitur Numerik", fontsize=13)
    plt.tight_layout()
    st.pyplot(fig3)
    plt.close()


# ════════════════════════════════════════════════════════════════════════════════
#  TAB 2 · EDA
# ════════════════════════════════════════════════════════════════════════════════
with tab_eda:
    st.header("📈 Exploratory Data Analysis")

    col1, col2 = st.columns(2)

    with col1:
        st.subheader("Durasi Tidur vs Kategori Stres")
        fig, ax = plt.subplots(figsize=(6, 4))
        order = ["Low", "Medium", "High"]
        pal = {k: PALETTE[k.lower()] for k in order}
        sns.boxplot(
            data=fdf, x="stress_category", y="sleep_hours",
            palette=pal, order=order, ax=ax,
        )
        ax.set_xlabel("Kategori Stres")
        ax.set_ylabel("Durasi Tidur (jam)")
        ax.set_title("Durasi Tidur per Kategori Stres")
        sns.despine()
        st.pyplot(fig)
        plt.close()

    with col2:
        st.subheader("Screen Time vs Kategori Stres")
        fig, ax = plt.subplots(figsize=(6, 4))
        sns.boxplot(
            data=fdf, x="stress_category", y="daily_screen_time_hours",
            palette=pal, order=order, ax=ax,
        )
        ax.set_xlabel("Kategori Stres")
        ax.set_ylabel("Screen Time (jam/hari)")
        ax.set_title("Screen Time per Kategori Stres")
        sns.despine()
        st.pyplot(fig)
        plt.close()

    col3, col4 = st.columns(2)

    with col3:
        st.subheader("Kualitas Tidur vs Stres")
        fig, ax = plt.subplots(figsize=(6, 4))
        sns.violinplot(
            data=fdf, x="stress_category", y="sleep_quality_score",
            palette=pal, order=order, ax=ax, inner="quartile",
        )
        ax.set_xlabel("Kategori Stres")
        ax.set_ylabel("Skor Kualitas Tidur")
        ax.set_title("Kualitas Tidur per Kategori Stres")
        sns.despine()
        st.pyplot(fig)
        plt.close()

    with col4:
        st.subheader("Penggunaan HP Sebelum Tidur")
        fig, ax = plt.subplots(figsize=(6, 4))
        sns.boxplot(
            data=fdf, x="stress_category",
            y="phone_usage_before_sleep_minutes",
            palette=pal, order=order, ax=ax,
        )
        ax.set_xlabel("Kategori Stres")
        ax.set_ylabel("Menit")
        ax.set_title("Penggunaan HP Sebelum Tidur")
        sns.despine()
        st.pyplot(fig)
        plt.close()

    st.markdown("---")
    st.subheader("Distribusi Tingkat Stres berdasarkan Pekerjaan")
    occ_stress = (
        fdf.groupby(["occupation", "stress_category"])
        .size()
        .reset_index(name="count")
    )
    pivot_occ = occ_stress.pivot(
        index="occupation", columns="stress_category", values="count"
    ).fillna(0)
    pivot_occ = pivot_occ.reindex(columns=["Low", "Medium", "High"], fill_value=0)
    pivot_occ["total"] = pivot_occ.sum(axis=1)
    pivot_pct = pivot_occ[["Low", "Medium", "High"]].div(pivot_occ["total"], axis=0) * 100
    fig5, ax5 = plt.subplots(figsize=(10, 5))
    pivot_pct.plot(
        kind="barh", ax=ax5,
        color=[PALETTE["low"], PALETTE["medium"], PALETTE["high"]],
        edgecolor="white", linewidth=0.5,
    )
    ax5.set_xlabel("Persentase (%)")
    ax5.set_ylabel("Pekerjaan")
    ax5.set_title("Proporsi Kategori Stres per Pekerjaan")
    ax5.legend(title="Kategori Stres")
    sns.despine()
    plt.tight_layout()
    st.pyplot(fig5)
    plt.close()


# ════════════════════════════════════════════════════════════════════════════════
#  TAB 3 · SEGMENTASI
# ════════════════════════════════════════════════════════════════════════════════
with tab_segment:
    st.header("🎯 Segmentasi Pengguna Berdasarkan Risiko")

    target_col = "stress_category"
    seg_summary = (
        fdf.groupby("priority_segment")
        .agg(
            jumlah_pengguna=("stress_level", "count"),
            rata_rata_stress=("stress_level", "mean"),
            high_stress_rate=(
                target_col,
                lambda x: (x.astype(str).str.lower() == "high").mean() * 100,
            ),
            rata_screen_time=("daily_screen_time_hours", "mean"),
            rata_sleep_quality=("sleep_quality_score", "mean"),
        )
        .round(2)
        .sort_values("high_stress_rate", ascending=False)
        .reset_index()
    )

    st.dataframe(seg_summary, use_container_width=True)

    col_s1, col_s2 = st.columns(2)

    with col_s1:
        fig, ax = plt.subplots(figsize=(6, 4))
        bar_colors = sns.color_palette("Reds_r", len(seg_summary))
        ax.barh(
            seg_summary["priority_segment"],
            seg_summary["high_stress_rate"],
            color=bar_colors,
        )
        ax.set_xlabel("High Stress Rate (%)")
        ax.set_title("Tingkat Stres Tinggi per Segmen")
        for i, v in enumerate(seg_summary["high_stress_rate"]):
            ax.text(v + 0.3, i, f"{v:.1f}%", va="center", fontsize=9)
        sns.despine()
        plt.tight_layout()
        st.pyplot(fig)
        plt.close()

    with col_s2:
        fig, ax = plt.subplots(figsize=(6, 4))
        ax.barh(
            seg_summary["priority_segment"],
            seg_summary["jumlah_pengguna"],
            color=sns.color_palette("Blues_r", len(seg_summary)),
        )
        ax.set_xlabel("Jumlah Pengguna")
        ax.set_title("Jumlah Pengguna per Segmen")
        for i, v in enumerate(seg_summary["jumlah_pengguna"]):
            ax.text(v + 10, i, f"{v:,}", va="center", fontsize=9)
        sns.despine()
        plt.tight_layout()
        st.pyplot(fig)
        plt.close()

    st.markdown("---")
    st.subheader("📌 Prioritas Intervensi")
    priority_info = {
        "high_screen_low_sleep_quality": {
            "label": "🔴 Kritis – High Screen + Low Sleep Quality",
            "desc": "Segmen paling berisiko. Butuh intervensi segera: reminder screen time, sleep hygiene, dan evaluasi stres harian.",
        },
        "high_screen_time": {
            "label": "🟠 Tinggi – High Screen Time",
            "desc": "Screen time berlebihan tanpa masalah tidur eksplisit. Fokus: pembatasan screen time & break reminder.",
        },
        "low_sleep_quality": {
            "label": "🟡 Sedang – Low Sleep Quality",
            "desc": "Kualitas tidur rendah tanpa screen time ekstrem. Fokus: tips sleep hygiene dan pengaturan jadwal tidur.",
        },
        "general_users": {
            "label": "🟢 Normal – General Users",
            "desc": "Risiko stres rendah. Cukup monitoring ringan dan rekomendasi preventif.",
        },
    }
    for seg, info in priority_info.items():
        with st.expander(info["label"]):
            st.write(info["desc"])
            subset = seg_summary[seg_summary["priority_segment"] == seg]
            if not subset.empty:
                row = subset.iloc[0]
                st.write(
                    f"**Jumlah pengguna:** {int(row['jumlah_pengguna']):,} | "
                    f"**High stress rate:** {row['high_stress_rate']:.1f}% | "
                    f"**Rata-rata screen time:** {row['rata_screen_time']:.1f} jam"
                )


# ════════════════════════════════════════════════════════════════════════════════
#  TAB 4 · Screening
# ════════════════════════════════════════════════════════════════════════════════
with tab_predict:
    st.header("🤖 Screening Tingkat Stres")
    st.caption("Model berbasis rule sederhana dari hasil EDA — cocok untuk demo tanpa melakukan training (hanya untuk screening).")

    st.subheader("Masukkan Data Pengguna")
    p1, p2, p3 = st.columns(3)
    age_in         = p1.number_input("Usia", 18, 60, 25)
    sleep_in       = p2.number_input("Durasi Tidur (jam)", 3.0, 10.0, 7.0, step=0.5)
    sleep_qual_in  = p3.number_input("Skor Kualitas Tidur (1–10)", 1.0, 10.0, 6.0, step=0.5)

    p4, p5, p6 = st.columns(3)
    screen_in      = p4.number_input("Screen Time Harian (jam)", 0.0, 16.0, 5.0, step=0.5)
    phone_sleep_in = p5.number_input("HP Sebelum Tidur (menit)", 0, 180, 45)
    caffeine_in    = p6.number_input("Asupan Kafein (cangkir)", 0, 10, 2)

    if st.button("🔍 Prediksi Sekarang", type="primary"):
        # Logika prediksi rule-based dari temuan EDA
        score = 0

        if screen_in >= 7:
            score += 3
        elif screen_in >= 5:
            score += 1.5

        if sleep_in < 5:
            score += 3
        elif sleep_in < 6.5:
            score += 1.5

        if sleep_qual_in <= 4:
            score += 2.5
        elif sleep_qual_in <= 6:
            score += 1

        if phone_sleep_in >= 60:
            score += 1.5
        elif phone_sleep_in >= 30:
            score += 0.5

        if caffeine_in >= 4:
            score += 0.5

        if screen_in >= 7 and sleep_qual_in <= 4:
            score += 1.5  # bonus interaksi

        # Normalisasi ke 1–10
        stress_score_pred = min(10, max(1, score))

        if stress_score_pred >= 7:
            cat_pred = "High"
            col_pred = PALETTE["high"]
            emoji_pred = "🔴"
        elif stress_score_pred >= 4:
            cat_pred = "Medium"
            col_pred = PALETTE["medium"]
            emoji_pred = "🟡"
        else:
            cat_pred = "Low"
            col_pred = PALETTE["low"]
            emoji_pred = "🟢"

        st.markdown("---")
        st.subheader("Hasil Prediksi")
        r1, r2 = st.columns(2)
        r1.metric("Estimasi Skor Stres", f"{stress_score_pred:.1f} / 10")
        r2.markdown(
            f"<h3 style='color:{col_pred}'>{emoji_pred} Kategori: {cat_pred}</h3>",
            unsafe_allow_html=True,
        )

        # Gauge sederhana
        fig, ax = plt.subplots(figsize=(5, 2.5))
        ax.barh([0], [stress_score_pred], color=col_pred, height=0.5)
        ax.barh([0], [10 - stress_score_pred], left=stress_score_pred,
                color="#ecf0f1", height=0.5)
        ax.set_xlim(0, 10)
        ax.set_yticks([])
        ax.set_xlabel("Skor Stres (1–10)")
        ax.set_title("Estimasi Tingkat Stres")
        sns.despine(left=True)
        st.pyplot(fig)
        plt.close()

        st.subheader("💡 Rekomendasi Personal")
        recs = []
        if screen_in >= 7:
            recs.append("📵 Batasi screen time di bawah 7 jam/hari, gunakan fitur Digital Wellbeing.")
        if sleep_in < 6:
            recs.append("😴 Tingkatkan durasi tidur ke minimal 7 jam. Tetapkan jadwal tidur yang konsisten.")
        if sleep_qual_in <= 4:
            recs.append("🛏 Perbaiki sleep hygiene: hindari layar 1 jam sebelum tidur, jaga suhu kamar.")
        if phone_sleep_in >= 60:
            recs.append("📱 Kurangi penggunaan HP sebelum tidur. Coba rutinitas relaksasi pengganti.")
        if caffeine_in >= 4:
            recs.append("☕ Kurangi kafein, terutama setelah pukul 14.00.")
        if not recs:
            recs.append("✅ Profil Anda terlihat sehat! Pertahankan pola tidur dan batasan screen time.")
        for r in recs:
            st.info(r)


# ════════════════════════════════════════════════════════════════════════════════
#  TAB 5 · INSIGHT & REKOMENDASI
# ════════════════════════════════════════════════════════════════════════════════
with tab_insights:
    st.header("💡 Insight Utama & Rekomendasi Bisnis")

    st.subheader("📌 Temuan Kunci dari Analisis Data")
    insights = [
        ("🔗 Korelasi Tinggi", "Mental fatigue score, daily screen time, dan sleep quality score adalah tiga fitur dengan korelasi terkuat terhadap tingkat stres."),
        ("😴 Pola Tidur Kritis", "Pengguna dengan durasi tidur < 6 jam memiliki rata-rata stress_level hampir 2× lebih tinggi dibanding pengguna tidur ≥ 7 jam."),
        ("📱 Screen Time Dominan", "Screen time > 7 jam/hari berkorelasi kuat dengan kategori stres tinggi, terutama bila dikombinasikan dengan kualitas tidur rendah."),
        ("🎯 Segmen Paling Berisiko", "Segmen high_screen_low_sleep_quality menunjukkan high stress rate 100% dengan rata-rata stress_level 9.94."),
        ("⚖️ Gender Seimbang", "Distribusi gender relatif merata sehingga model berlaku representatif untuk semua gender."),
    ]
    for title, desc in insights:
        st.markdown(f"**{title}**: {desc}")

    st.markdown("---")
    st.subheader("🏢 Rekomendasi Produk per Segmen")
    rec_data = {
        "Segmen": [
            "high_screen_low_sleep_quality",
            "high_screen_time",
            "low_sleep_quality",
            "general_users",
        ],
        "Prioritas": ["🔴 Kritis", "🟠 Tinggi", "🟡 Sedang", "🟢 Normal"],
        "Rekomendasi Utama": [
            "Reminder screen time + sleep hygiene + evaluasi stres harian",
            "Fitur pembatasan screen time + break reminder + aktivitas non-digital",
            "Tips kualitas tidur + reminder jadwal tidur + edukasi sleep hygiene",
            "Monitoring ringan + rekomendasi preventif",
        ],
    }
    st.dataframe(pd.DataFrame(rec_data), use_container_width=True)

    st.markdown("---")
    st.subheader("📊 Ringkasan Statistik Deskriptif Dataset")
    display_cols = [
        "age", "sleep_hours", "sleep_quality_score",
        "daily_screen_time_hours", "phone_usage_before_sleep_minutes",
        "stress_level",
    ]
    display_cols = [c for c in display_cols if c in fdf.columns]
    st.dataframe(fdf[display_cols].describe().round(2), use_container_width=True)

    st.markdown("---")
    st.subheader("📁 Data Dictionary")
    dd = {
        "Kolom": [
            "age", "gender", "occupation", "daily_screen_time_hours",
            "phone_usage_before_sleep_minutes", "sleep_hours",
            "sleep_quality_score", "stress_level", "stress_category",
            "caffeine_intake_cups", "physical_activity_minutes",
            "notifications_received_per_day", "mental_fatigue_score",
            "sleep_duration_category", "sleep_quality_category",
            "phone_usage_before_sleep_category", "poor_quality_and_short_sleep",
            "high_phone_usage_low_sleep", "sleep_deficit_hours", "priority_segment",
        ],
        "Tipe": [
            "int", "str", "str", "float", "int", "float", "float",
            "int", "str (Low/Medium/High)", "int", "int", "int", "float",
            "str", "str", "str", "int (0/1)", "int (0/1)", "float", "str",
        ],
        "Deskripsi": [
            "Usia pengguna (tahun)",
            "Jenis kelamin (Male/Female/Other)",
            "Pekerjaan pengguna",
            "Total screen time harian (jam)",
            "Durasi penggunaan HP sebelum tidur (menit)",
            "Durasi tidur (jam)",
            "Skor kualitas tidur 1–10",
            "Skor stres numerik 1–10",
            "Kategori target stres untuk klasifikasi",
            "Konsumsi kafein harian (cangkir)",
            "Durasi aktivitas fisik (menit/hari)",
            "Notifikasi diterima per hari",
            "Skor kelelahan mental",
            "Kategori durasi tidur: short/ideal/long",
            "Kategori kualitas tidur: poor/average/good",
            "Kategori penggunaan HP: low/moderate/high",
            "Flag: kualitas tidur buruk & tidur < 6 jam",
            "Flag: HP sebelum tidur tinggi & tidur < 6 jam",
            "Kekurangan tidur dari 7 jam (jam)",
            "Segmen prioritas intervensi",
        ],
    }
    st.dataframe(pd.DataFrame(dd), use_container_width=True)
