import { expect } from "chai";
import { TaskFactory } from "./Task.factory";

const FAKE_UUID = "24d5ad6d-b864-4dee-a217-2608b6706cb6";

describe("Test Task factory", () => {
  it("Should create a Task", () => {
    const task = TaskFactory.create("title", FAKE_UUID);

    expect(task.id).to.exist;
    expect(task.title).to.be.equal("title");
    expect(task.description).to.be.equal(null);
    expect(task.status).to.be.equal("TODO");
    expect(task.userId).to.be.equal(FAKE_UUID);
  });

  it("Should create a Task with description", () => {
    const task = TaskFactory.createWithDescription(
      "title",
      "description",
      FAKE_UUID
    );

    expect(task.id).to.exist;
    expect(task.title).to.be.equal("title");
    expect(task.description).to.be.equal("description");
    expect(task.status).to.be.equal("TODO");
    expect(task.userId).to.be.equal(FAKE_UUID);
  });
});
