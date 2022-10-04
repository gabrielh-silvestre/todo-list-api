import { expect } from "chai";
import shell from "shelljs";

import { TaskFactory } from "../../../../domain/task/factory/Task.factory";

import { TasksRepository } from "./Task.repository";

const FAKE_UUID = "24d5ad6d-b864-4dee-a217-2608b6706cb6";
const PRISMA_SEED_RESET = "prisma migrate dev && npx prisma db seed";

describe("Test TasksRepository with Prisma", function () {
  this.timeout(50000);

  before(() => {
    shell.exec(PRISMA_SEED_RESET, { silent: true });
  });

  it("should be able to list all tasks", async () => {
    const taskRepository = new TasksRepository();
    const newTask1 = TaskFactory.create("title1", FAKE_UUID);
    const newTask2 = TaskFactory.create("title2", FAKE_UUID);
    const newTask3 = TaskFactory.create("title3", FAKE_UUID);

    await taskRepository.create(newTask1);
    await taskRepository.create(newTask2);
    await taskRepository.create(newTask3);

    const foundTasks = await taskRepository.findAll(FAKE_UUID);

    expect(foundTasks).to.be.not.null;
    expect(foundTasks.length).to.be.equal(3);
  });

  it("should be able to find a task by id", async () => {
    const taskRepository = new TasksRepository();
    const newTask = TaskFactory.create("find by id title", FAKE_UUID);

    await taskRepository.create(newTask);

    const foundTask = await taskRepository.find(FAKE_UUID, newTask.id);

    expect(foundTask).to.be.not.null;
    expect(foundTask?.id).to.be.equal(newTask.id);
    expect(foundTask?.title).to.be.equal(newTask.title);
    expect(foundTask?.description).to.be.equal(newTask.description);
    expect(foundTask?.status).to.be.equal(newTask.status);
    expect(foundTask?.userId).to.be.equal(newTask.userId);
  });

  it("should be able to find a task by title", async () => {
    const taskRepository = new TasksRepository();
    const newTask = TaskFactory.create("find by title title", FAKE_UUID);

    await taskRepository.create(newTask);

    const foundTask = await taskRepository.findByTitle(
      FAKE_UUID,
      newTask.title
    );

    expect(foundTask).to.be.not.null;
    expect(foundTask?.id).to.be.equal(newTask.id);
    expect(foundTask?.title).to.be.equal(newTask.title);
    expect(foundTask?.description).to.be.equal(newTask.description);
    expect(foundTask?.status).to.be.equal(newTask.status);
    expect(foundTask?.userId).to.be.equal(newTask.userId);
  });

  it("should be able to create a new task", async () => {
    const taskRepository = new TasksRepository();
    const newTask = TaskFactory.create("create title", FAKE_UUID);

    await taskRepository.create(newTask);

    const foundTask = await taskRepository.find(FAKE_UUID, newTask.id);

    expect(foundTask).to.be.not.null;
    expect(foundTask?.id).to.be.equal(newTask.id);
    expect(foundTask?.title).to.be.equal(newTask.title);
    expect(foundTask?.description).to.be.equal(newTask.description);
    expect(foundTask?.status).to.be.equal(newTask.status);
    expect(foundTask?.userId).to.be.equal(newTask.userId);
  });

  it("should be able to update a task", async () => {
    const taskRepository = new TasksRepository();
    const newTask = TaskFactory.create("update title", FAKE_UUID);

    await taskRepository.create(newTask);

    const foundTask = await taskRepository.find(FAKE_UUID, newTask.id);

    foundTask?.changeTitle("new title");
    foundTask?.changeDescription("new description");

    await taskRepository.update(foundTask!);

    const updatedTask = await taskRepository.find(FAKE_UUID, newTask.id);

    expect(updatedTask).to.be.not.null;
    expect(updatedTask?.id).to.be.equal(foundTask?.id);
    expect(updatedTask?.title).to.be.equal(foundTask?.title);
    expect(updatedTask?.description).to.be.equal(foundTask?.description);
    expect(updatedTask?.status).to.be.equal(foundTask?.status);
    expect(updatedTask?.userId).to.be.equal(foundTask?.userId);
  });

  it("should be able to delete a task", async () => {
    const taskRepository = new TasksRepository();
    const newTask1 = TaskFactory.create("delete title1", FAKE_UUID);
    const newTask2 = TaskFactory.create("delete title2", FAKE_UUID);
    const newTask3 = TaskFactory.create("delete title3", FAKE_UUID);

    await taskRepository.create(newTask1);
    await taskRepository.create(newTask2);
    await taskRepository.create(newTask3);

    await taskRepository.delete(FAKE_UUID, newTask2.id);

    const deletedTask = await taskRepository.find(FAKE_UUID, newTask2.id);

    expect(deletedTask).to.be.null;
  });
});
