export const reserves = {
  amboseli: {
    id: "amboseli",
    name: "Amboseli National Reserve",
    country: "Kenya",
    snapshotDate: "20 Aug 2026",
    description:
      "An evidence-linked ecosystem check-up using the latest available environmental signals.",
    signals: [
      {
        id: "vegetation",
        icon: "leaf",
        value: "-12%",
        direction: "↓",
        label: "Vegetation Health",
        caption: "vs. 6-month baseline",
        status: "warning",
      },
      {
        id: "climate",
        icon: "thermometer",
        value: "Elevated",
        direction: "↑",
        label: "Climate Stress",
        caption: "Current status",
        status: "critical",
      },
      {
        id: "wildlife",
        icon: "paw",
        value: "Stable",
        direction: "→",
        label: "Wildlife Activity",
        caption: "Observation activity proxy",
        status: "healthy",
      },
      {
        id: "disturbance",
        icon: "flame",
        value: "Low",
        direction: "↓",
        label: "Disturbance Risk",
        caption: "Recent thermal alerts",
        status: "healthy",
      },
    ],
    summary: {
      vegetationPrefix: "Vegetation vigor has",
      vegetationClaim: "declined by 12%",
      vegetationSuffix:
        "compared with the six-month baseline, alongside",
      rainfallClaim: "below-average rainfall",
      climatePrefix: "and prolonged dry conditions. Climate stress remains",
      climateClaim: "elevated",
      ending:
        ". Wildlife observation activity is stable, while disturbance risk is low.",
    },
    ndvi: {
      title: "Vegetation Health Trend (NDVI)",
      description:
        "Mean vegetation vigor fell from 0.60 baseline to 0.53 during the selected six-month comparison period.",
      baseline: 0.6,
      confidence: "Moderate confidence",
      source: "Sentinel-2 / Copernicus",
      method: "Mean NDVI comparison",
      limitation: "NDVI is a vegetation-vigor proxy.",
      data: [
        { month: "Nov '25", ndvi: 0.65, baseline: 0.6 },
        { month: "Dec '25", ndvi: 0.68, baseline: 0.6 },
        { month: "Jan '26", ndvi: 0.66, baseline: 0.6 },
        { month: "Feb '26", ndvi: 0.61, baseline: 0.6 },
        { month: "Mar '26", ndvi: 0.56, baseline: 0.6 },
        { month: "Apr '26", ndvi: 0.51, baseline: 0.6 },
        { month: "May '26", ndvi: 0.45, baseline: 0.6 },
      ],
        },

    climate: {
      title: "Rainfall Trend",
      description:
        "Cumulative monthly rainfall was below the six-month historical baseline, contributing to elevated climate stress.",
      baselineLabel: "Historical monthly baseline",
      baseline: 62,
      confidence: "High confidence",
      source: "Open-Meteo historical weather",
      method: "Monthly precipitation comparison",
      limitation:
        "Weather values are gridded estimates and may differ from on-site rain-gauge measurements.",
      unit: "mm",
      data: [
        { month: "Nov '25", rainfall: 48, baseline: 62 },
        { month: "Dec '25", rainfall: 52, baseline: 62 },
        { month: "Jan '26", rainfall: 41, baseline: 62 },
        { month: "Feb '26", rainfall: 36, baseline: 62 },
        { month: "Mar '26", rainfall: 44, baseline: 62 },
        { month: "Apr '26", rainfall: 39, baseline: 62 },
        { month: "May '26", rainfall: 31, baseline: 62 },
      ],
    },
  },

  keoladeo: {
    id: "keoladeo",
    name: "Keoladeo National Park",
    country: "India",
    snapshotDate: "18 Aug 2026",
    description:
      "A wetland ecosystem check-up combining vegetation, climate, observation, and disturbance signals.",
    signals: [
      {
        id: "vegetation",
        icon: "leaf",
        value: "+8%",
        direction: "↑",
        label: "Vegetation Health",
        caption: "vs. 6-month baseline",
        status: "healthy",
      },
      {
        id: "climate",
        icon: "thermometer",
        value: "Watch",
        direction: "→",
        label: "Climate Stress",
        caption: "Rainfall recovery incomplete",
        status: "warning",
      },
      {
        id: "wildlife",
        icon: "paw",
        value: "Rising",
        direction: "↑",
        label: "Wildlife Activity",
        caption: "Observation activity proxy",
        status: "healthy",
      },
      {
        id: "disturbance",
        icon: "flame",
        value: "Watch",
        direction: "→",
        label: "Disturbance Risk",
        caption: "1 recent thermal alert",
        status: "warning",
      },
    ],
    summary: {
      vegetationPrefix: "Vegetation vigor has",
      vegetationClaim: "improved by 8%",
      vegetationSuffix:
        "compared with the six-month baseline. Seasonal recovery is visible, though",
      rainfallClaim: "rainfall recovery remains incomplete",
      climatePrefix: "and climate stress remains on",
      climateClaim: "watch",
      ending:
        ". Wildlife observation activity is rising, and one recent thermal alert warrants continued monitoring.",
    },
    ndvi: {
      title: "Vegetation Health Trend (NDVI)",
      description:
        "Mean vegetation vigor rose from 0.49 baseline to 0.53 during the selected six-month comparison period.",
      baseline: 0.49,
      confidence: "Moderate confidence",
      source: "Sentinel-2 / Copernicus",
      method: "Mean NDVI comparison",
      limitation:
        "Wetland vegetation patterns can vary with water level and seasonal management.",
      data: [
        { month: "Nov '25", ndvi: 0.43, baseline: 0.49 },
        { month: "Dec '25", ndvi: 0.44, baseline: 0.49 },
        { month: "Jan '26", ndvi: 0.46, baseline: 0.49 },
        { month: "Feb '26", ndvi: 0.48, baseline: 0.49 },
        { month: "Mar '26", ndvi: 0.5, baseline: 0.49 },
        { month: "Apr '26", ndvi: 0.52, baseline: 0.49 },
        { month: "May '26", ndvi: 0.53, baseline: 0.49 },
      ],
        },

    climate: {
      title: "Rainfall Recovery Trend",
      description:
        "Monthly rainfall is improving but remains below the historical baseline, so climate stress remains on watch.",
      baselineLabel: "Historical monthly baseline",
      baseline: 48,
      confidence: "High confidence",
      source: "Open-Meteo historical weather",
      method: "Monthly precipitation comparison",
      limitation:
        "Weather values are gridded estimates and may differ from on-site rain-gauge measurements.",
      unit: "mm",
      data: [
        { month: "Nov '25", rainfall: 29, baseline: 48 },
        { month: "Dec '25", rainfall: 32, baseline: 48 },
        { month: "Jan '26", rainfall: 35, baseline: 48 },
        { month: "Feb '26", rainfall: 39, baseline: 48 },
        { month: "Mar '26", rainfall: 41, baseline: 48 },
        { month: "Apr '26", rainfall: 44, baseline: 48 },
        { month: "May '26", rainfall: 45, baseline: 48 },
      ],
    },
  },
};