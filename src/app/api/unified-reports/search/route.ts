// src/app/api/unified-reports/search/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/db/dbConnect"; 
import CmaReport from "@/db/models/cmaReportModel"; 
import ProjectReportModel from "@/db/models/projectReportModel"; 
import { requireAuth } from "@/lib/requireAuth";

export async function GET(request: Request) {
  try {
    const session = await requireAuth(request); // Security ke liye auth check
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    const type = searchParams.get("type"); // 'cma', 'project' or null for both

    const searchRegex = new RegExp(q, "i");
    const queryFilter = {
      userId: session.user.id, // Sirf usi user ki reports dikhe
      $or: [
        { name: searchRegex },
        { businessName: searchRegex }, // Aapke models mein businessName bhi ho sakta hai
        { createdAt: searchRegex }
      ]
    };

    let results = [];

    // Unified Logic: Type ke basis par decide karna
    if (type === 'cma') {
      // Sirf CMA mein search karo
      const cmaData = await CmaReport.find(queryFilter).lean();
      results = cmaData.map(item => ({ ...item, reportType: 'CMA' }));
      
    } else if (type === 'project') {
      // Sirf Project Report mein search karo
      const projectData = await ProjectReportModel.find(queryFilter).lean();
      results = projectData.map(item => ({ ...item, reportType: 'Project' }));
      
    } else {
      // Agar type nahi bheja, to dono mein search karo (Asli Unified Search)
      const [cmaData, projectData] = await Promise.all([
        CmaReport.find(queryFilter).lean(),
        ProjectReportModel.find(queryFilter).lean()
      ]);
      
      results = [
        ...cmaData.map(item => ({ ...item, reportType: 'CMA' })),
        ...projectData.map(item => ({ ...item, reportType: 'Project' }))
      ];
    }

    // Latest Reports hamesha TOP par dikhni chahiye
    results.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(results);

  } catch (error: any) {
    console.error("SEARCH_ERROR:", error);
    return NextResponse.json({ message: "Search Error", details: error.message }, { status: 500 });
  }
}