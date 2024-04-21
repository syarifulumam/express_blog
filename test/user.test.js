import supertest from "supertest";
import { web } from "../src/application/web.js";
import { createTestUser, removeTestUser } from "./test-util.js";
import { logger } from "../src/application/logging.js";

describe("POST /api/users", function () {
  afterEach(async () => {
    await removeTestUser();
  });

  it("should can register new user", async () => {
    const result = await supertest(web).post("/api/users").send({
      email: "test@gmail.com",
      password: "password",
      name: "test",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();
  });

  it("should reject if request is invalid", async () => {
    const result = await supertest(web).post("/api/users").send({
      email: "",
      password: "",
      name: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });

  it("should reject if username already registered", async () => {
    let result = await supertest(web).post("/api/users").send({
      email: "test@gmail.com",
      password: "password",
      name: "test",
    });

    expect(result.status).toBe(200);
    expect(result.body.data.email).toBe("test@gmail.com");
    expect(result.body.data.name).toBe("test");
    expect(result.body.data.password).toBeUndefined();

    result = await supertest(web).post("/api/users").send({
      email: "test@gmail.com",
      password: "password",
      name: "test",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
});

describe("POST /api/users/login", function () {
  beforeEach(async () => {
    await createTestUser();
  });
  afterEach(async () => {
    await removeTestUser();
  });
  it("should can login", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "password",
    });
    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.data.token).not.toBe("");
  });
  it("should reject login if request is invalid", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "",
      password: "",
    });

    expect(result.status).toBe(400);
    expect(result.body.errors).toBeDefined();
  });
  it("should reject login if password is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "test@gmail.com",
      password: "passwords",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
  it("should reject login if email is wrong", async () => {
    const result = await supertest(web).post("/api/users/login").send({
      email: "test1@gmail.com",
      password: "password",
    });

    expect(result.status).toBe(401);
    expect(result.body.errors).toBeDefined();
  });
});

// describe("GET /api/users/current", function () {
//   beforeEach(async () => {
//     await createTestUser();
//   });
//   afterEach(async () => {
//     await removeTestUser();
//   });
// });
