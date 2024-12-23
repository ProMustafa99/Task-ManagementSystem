import { App } from "@/app";
import request from "supertest";
import { Sequelize } from "sequelize";
import { BlogRoute } from "@/routes/blog_mangment_route";

afterAll(async () => {
  await new Promise<void>((resolve) => setTimeout(resolve, 500));
});

describe("Testing Blog Service", () => {
  describe("[GET] /blog", () => {
    it("responds with all blogs", async () => {
      // Mock Sequelize to skip actual DB connection
      (Sequelize as any).authenticate = jest.fn().mockResolvedValue(true);

      // Mock BlogService
      const blogRoute = new BlogRoute();
      blogRoute.blog.blogService.getAllBlog = jest.fn().mockResolvedValue([
        { id: 1, title_en: "Test Blog", title_ar: "اختبار المدونات" },
        { id: 2, title_en: "Test Blog2", title_ar: "اختبار المدونات" },
        { id: 3, title_en: "Test Blog3", title_ar: "اختبار المدونات" },
        { id: 4, title_en: "Test Blog4", title_ar: "اختبار المدونات" },
      ]);

      // Start the app
      const app = new App([blogRoute]);

      // Perform GET request to blog endpoint
      const response = await request(app.getServer()).get(`${blogRoute.path}`).expect(200);

      // Assertions
      expect(response.body.data).toHaveLength(4); // Ensure 4 blogs were returned
      expect(response.body.data[0]).toHaveProperty("title_en", "Test Blog");
    });
  });
});
