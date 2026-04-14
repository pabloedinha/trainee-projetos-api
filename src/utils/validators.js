const PROJECT_STATUSES = ["Planejamento", "Em andamento", "Em revisão", "Concluído"];
const TASK_STATUSES = ["A fazer", "Em andamento", "Em revisão", "Concluída"];
const PRIORITIES = ["Baixa", "Média", "Alta"];
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveNumber(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isInteger(value) {
  return Number.isInteger(value);
}

function isPercentage(value) {
  return isInteger(value) && value >= 0 && value <= 100;
}

function isValidDateString(value) {
  if (!isNonEmptyString(value) || !ISO_DATE_PATTERN.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);

  return (
    date.getFullYear() === year &&
    date.getMonth() + 1 === month &&
    date.getDate() === day
  );
}

function validateTaskPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  return (
    isInteger(payload.projectId) &&
    isNonEmptyString(payload.title) &&
    isNonEmptyString(payload.description) &&
    TASK_STATUSES.includes(payload.status) &&
    PRIORITIES.includes(payload.priority) &&
    isNonEmptyString(payload.assignee) &&
    isValidDateString(payload.dueDate) &&
    isPositiveNumber(payload.estimatedHours)
  );
}

function validateProjectPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return false;
  }

  return (
    isNonEmptyString(payload.name) &&
    isNonEmptyString(payload.client) &&
    isNonEmptyString(payload.description) &&
    PROJECT_STATUSES.includes(payload.status) &&
    isPercentage(payload.progress) &&
    isValidDateString(payload.dueDate) &&
    isNonEmptyString(payload.owner) &&
    PRIORITIES.includes(payload.priority)
  );
}

function validateTaskStatusPayload(payload) {
  return Boolean(payload && TASK_STATUSES.includes(payload.status));
}

function validateTaskFilters(filters) {
  if (filters.projectId !== undefined) {
    const projectId = Number(filters.projectId);

    if (!Number.isInteger(projectId)) {
      return { valid: false, message: "Filtro projectId inválido." };
    }
  }

  if (filters.status !== undefined && !TASK_STATUSES.includes(filters.status)) {
    return { valid: false, message: "Filtro status inválido." };
  }

  if (filters.priority !== undefined && !PRIORITIES.includes(filters.priority)) {
    return { valid: false, message: "Filtro priority inválido." };
  }

  return { valid: true };
}

module.exports = {
  PRIORITIES,
  PROJECT_STATUSES,
  TASK_STATUSES,
  isValidDateString,
  validateProjectPayload,
  validateTaskFilters,
  validateTaskPayload,
  validateTaskStatusPayload
};
