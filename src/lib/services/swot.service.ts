export function generateSWOT() {
  const swotAnalysis = {
    strengths: [
      "Unique selling proposition (USP)", "Strong brand reputation",
      "High-quality products/services", "Skilled and experienced workforce",
      "Strong customer loyalty", "Efficient supply chain and operations", "Financial stability"
    ],
    weaknesses: [
      "Limited market reach", "High operational costs",
      "Dependence on a single revenue stream", "Outdated technology or processes",
      "Weak online presence", "Lack of skilled employees in key areas"
    ],
    opportunities: [
      "Growing market demand", "Emerging technology improvements",
      "Expansion into new markets", "Strategic partnerships and collaborations",
      "Changing customer preferences", "Government incentives and grants"
    ],
    threats: [
      "Increased competition", "Economic downturns",
      "Changing regulations and compliance issues", "Rising costs of raw materials",
      "Technological disruptions", "Negative public perception or PR crises"
    ]
  };

  const actionPlan = {
    leverageStrengths: [
      "Boost brand awareness via marketing campaigns (3-6 months).",
      "Enhance workforce skills with training programs (Ongoing).",
      "Strengthen customer loyalty with rewards programs (2-4 months)."
    ],
    improveWeaknesses: [
      "Expand market reach through digital marketing (6-12 months).",
      "Reduce operational costs by optimizing expenses (3-6 months).",
      "Strengthen online presence with SEO and e-commerce (6 months)."
    ],
    capitalizeOpportunities: [
      "Invest in automation and AI for efficiency (12 months).",
      "Research and enter new markets (6-12 months).",
      "Build strategic partnerships (Ongoing)."
    ],
    mitigateThreats: [
      "Differentiate with innovation and customer service (Ongoing).",
      "Develop a financial contingency plan (6 months).",
      "Ensure regulatory compliance (Ongoing)."
    ]
  };

  return { swotAnalysis, actionPlan };
}
