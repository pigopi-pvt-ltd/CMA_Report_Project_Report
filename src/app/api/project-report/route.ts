import dbConnect from "@/db/dbConnect";
import { requireAuth } from "@/lib/requireAuth";
import ProjectReport from "@/models/projectReportModel";
import { projectReportZodSchema } from "@/Schemas/projectReportSchema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const session = await requireAuth(request)
    console.log(session)
    await dbConnect();
    const body = await request.json()
    const data = projectReportZodSchema.parse(body)

    const project = await ProjectReport.create({
      ...data,
      userId: session.user.id
    });

    return NextResponse.json({
      message: "Project Created Successfully",
      data: project
    }, { status: 200 })

  } catch (error: any) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          errors: error.issues.map((e: any) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        { status: 400 }
      );
    }
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.json({
      message: "Internal Server Error: " + error
    }, { status: 500 });
  }
}
