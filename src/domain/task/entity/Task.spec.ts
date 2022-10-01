import { expect } from "chai";
import { Task } from "./Task";

const FAKE_UUID = "24d5ad6d-b864-4dee-a217-2608b6706cb6";

describe("Test Task domain entity", () => {
  it("Should create a Task", () => {
    const task = new Task(FAKE_UUID, "title", "description", "TODO", FAKE_UUID);

    expect(task.id).to.be.equal(FAKE_UUID);
    expect(task.title).to.be.equal("title");
    expect(task.description).to.be.equal("description");
    expect(task.status).to.be.equal("TODO");
    expect(task.userId).to.be.equal(FAKE_UUID);
  });

  it("Should change title", () => {
    const task = new Task(FAKE_UUID, "title", "description", "TODO", FAKE_UUID);

    task.changeTitle("new title");

    expect(task.title).to.be.equal("new title");
  });

  it("Should change description", () => {
    const task = new Task(FAKE_UUID, "title", "description", "TODO", FAKE_UUID);

    task.changeDescription("new description");

    expect(task.description).to.be.equal("new description");
  });

  it("Should change status", () => {
    const task = new Task(FAKE_UUID, "title", "description", "TODO", FAKE_UUID);

    task.changeStatus("IN_PROGRESS");

    expect(task.status).to.be.equal("IN_PROGRESS");
  });

  it("Should throw error when title is too small", () => {
    expect(() => {
      new Task(FAKE_UUID, "t", "description", "TODO", FAKE_UUID);
    }).to.throw('"title" length must be at least 5 characters long');
  });

  it("Should throw error when title is too big", () => {
    expect(() => {
      new Task(FAKE_UUID, "title".repeat(20), "description", "TODO", FAKE_UUID);
    }).to.throw(
      '"title" length must be less than or equal to 20 characters long'
    );
  });

  it("Should throw error when description is too big", () => {
    expect(() => {
      new Task(
        FAKE_UUID,
        "title",
        "description".repeat(120),
        "TODO",
        FAKE_UUID
      );
    }).to.throw(
      '"description" length must be less than or equal to 120 characters long'
    );
  });

  it("Should throw error when status is invalid", () => {
    expect(() => {
      new Task(FAKE_UUID, "title", "description", "INVALID" as any, FAKE_UUID);
    }).to.throw('"status" must be one of [TODO, IN_PROGRESS, DONE]');
  });

  it("Should throw error when userId is invalid", () => {
    expect(() => {
      new Task(FAKE_UUID, "title", "description", "TODO", "invalid");
    }).to.throw('"userId" must be a valid GUID');
  });
});
