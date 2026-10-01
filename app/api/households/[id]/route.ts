import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const updated = await prisma.household.update({
      where: { id: params.id },
      data: {
        headName: data.headName,
        address: data.address,
        memberCount: data.memberCount,
        status: data.status,
        latitude: data.latitude,
        longitude: data.longitude,
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating household:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.household.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting household:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
