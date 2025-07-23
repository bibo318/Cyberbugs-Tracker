import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("🧪 Test API endpoint called")

    const testData = {
      status: "success",
      message: "API is working correctly",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      version: "1.0.0",
      endpoints: {
        search: "/api/search",
        test: "/api/test",
      },
    }

    console.log("✅ Test API response:", testData)

    return NextResponse.json(testData)
  } catch (error) {
    console.error("❌ Test API error:", error)

    return NextResponse.json(
      {
        status: "error",
        message: "API test failed",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
