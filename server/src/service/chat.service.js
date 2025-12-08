import prisma from "../lib/db";

export class chatService {
  async getConversations(userId) {
    return await prisma.conversation.findMany({
      where: { userId },
      include: {
        messages: {
          take: 1,
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
  }

  async deleteConversation(conversationId, userId) {
    return await prisma.conversation.deleteMany({
      where: {
        userId,
        id: conversationId,
      },
    });
  }

  async createConversation(userId, mode = "chat", title = null) {
    return prisma.conversation.create({
      data: {
        userId,
        title: title || `new ${mode} conversation`,
        mode,
      },
    });
  }

  async getOrCreateConversation(
    userId,
    conversationId,
    mode = "chat",
    title = null
  ) {
    if (conversationId) {
      const conversation = await prisma.conversation.findFirst({
        where: {
          id: conversationId,
          userId: userId,
        },
        include: {
          messages: {
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      });

      if (conversation) return conversation;
    }

    return await this.createConversation(userId, mode, title);
  }

  async addMessage(conversationId, role, content) {
    const contentStr =
      typeof content === "string" ? content : JSON.stringify(content);
    return await prisma.messages.create({
      data: {
        conversationId,
        role,
        content: contentStr,
      },
    });
  }

  async getMessages(conversationId) {
    return await prisma.messages.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}
