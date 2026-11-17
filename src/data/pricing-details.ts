export interface PlanDetail {
  id: "project_plan" | "combo_plan";
  name: string;
  cardTitle: string;
  cardDescription: string;
  price: number;
  billingCycle: "month";
  isMostPopular: boolean;
  canCreateProjectReport: boolean;
  canCreateCMAReport: boolean;
  badge?: string;
  checkListDetails: {
    id: number;
    checkItemDescription: string;
  }[];
}

export const SAAS_PLANS: Record<string, PlanDetail> = {
  project_plan: {
    id: "project_plan",
    name: "Project Report Plan",
    cardTitle: "Project Report",
    cardDescription: "Ideal for businesses requiring professional detailed Project Reports accepted by all banks.",
    price: 699,
    billingCycle: "month",
    isMostPopular: false,
    canCreateProjectReport: true,
    canCreateCMAReport: false,
    badge: "Basic",
    checkListDetails: [
      { id: 1, checkItemDescription: "Generate Unlimited Project Reports" },
      { id: 2, checkItemDescription: "Accepted by all Indian Banks (Mudra, PMEGP, MSME)" },
      { id: 3, checkItemDescription: "Up to 10 years financial projection" },
      { id: 4, checkItemDescription: "Depreciation, DSCR & Repayment schedules" },
      { id: 5, checkItemDescription: "EBITDA, ROI, Break-even & Ratio Analysis" },
      { id: 6, checkItemDescription: "Export High-Resolution Watermark-free PDFs" },
      { id: 7, checkItemDescription: "Valid for 1 Month" }
    ]
  },
  combo_plan: {
    id: "combo_plan",
    name: "Project Report + CMA Report Plan",
    cardTitle: "Project + CMA Report",
    cardDescription: "Complete suite for loan proposals, working capital limits, CC limits and CMA data submissions.",
    price: 999,
    billingCycle: "month",
    isMostPopular: true,
    canCreateProjectReport: true,
    canCreateCMAReport: true,
    badge: "Best Value",
    checkListDetails: [
      { id: 1, checkItemDescription: "All Project Report Features included" },
      { id: 2, checkItemDescription: "Full CMA Report generation (Form I to Form VI)" },
      { id: 3, checkItemDescription: "MPBF calculation & Working capital assessment" },
      { id: 4, checkItemDescription: "Projected Balance Sheets & Cash Flow Statements" },
      { id: 5, checkItemDescription: "Export Both Project & CMA PDF Reports" },
      { id: 6, checkItemDescription: "Priority Email & WhatsApp Support" },
      { id: 7, checkItemDescription: "Valid for 1 Month" }
    ]
  }
};

const pricingDetails = Object.values(SAAS_PLANS);

export default pricingDetails;
