import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { pushFileToRepo } from "@/lib/github";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { content, fileName, type } = await req.json();
    
    if (!content || !fileName) {
        return NextResponse.json({ error: "Missing content or filename" }, { status: 400 });
    }

    const fullFileName = `${fileName}.${type === 'svg' ? 'svg' : 'md'}`;
    const fileContent = type === 'svg' ? content : `\`\`\`mermaid\n${content}\n\`\`\``;
    
    const url = await pushFileToRepo(
      session.accessToken,
      fullFileName,
      fileContent,
      `Update ${fullFileName} via DevStudy`
    );

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
