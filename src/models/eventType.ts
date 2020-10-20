import shortid from "shortid";
import {
  EventTypeDocument,
  EventTypeModel,
  getEventTypeKey,
  getEventTypesByBandQueryKey,
} from "../db";
import type {
  EventTypeCreateInput,
  EventType,
  BandId,
  EventTypeId,
} from "./types";

const getEventTypeFromRecord = (record: EventTypeDocument): EventType => ({
  bandId: record.pk,
  id: record.sk,
  name: record.eventTypeName,
  color: record.eventTypeColor,
});

const getEventTypeFromCreateInput = (
  createInput: EventTypeCreateInput,
): EventType => ({
  id: shortid.generate(),
  ...createInput,
});

const getRecordFromEventType = (model: EventType): EventTypeDocument => new EventTypeModel({
  pk: model.bandId,
  sk: model.id,
  eventTypeName: model.name,
  eventTypeColor: model.color,
});

export const createEventType = async (
  createInput: EventTypeCreateInput,
): Promise<EventType> => {
  try {
    const eventType = getEventTypeFromCreateInput(createInput);
    const eventTypeRecord = getRecordFromEventType(eventType);
    await eventTypeRecord.save();
    return eventType;
  } catch (e) {
    throw new Error(
      `Failed to create event type with name: ${createInput.name}: ${e.message}`,
    );
  }
};

export const createEventTypes = async (
  createInputs: EventTypeCreateInput[],
) => {
  try {
    const eventTypes = createInputs.map((createInput) => getEventTypeFromCreateInput(createInput));
    const eventTypeRecords = eventTypes.map((eventType) => getRecordFromEventType(eventType));
    await EventTypeModel.batchPut(eventTypeRecords);
    return eventTypes;
  } catch (e) {
    throw new Error(
      `Failed to batch create event types with error: ${e.message}`,
    );
  }
};

export const fetchEventTypeById = async (id: EventTypeId, bandId: BandId) => {
  try {
    const eventTypeRecord = await EventTypeModel.get(
      getEventTypeKey(id, bandId),
    );
    return getEventTypeFromRecord(eventTypeRecord);
  } catch (e) {
    throw new Error(
      `Failed to fetch event type with id: ${id} for band with id: ${bandId} with error: ${e.message}`,
    );
  }
};

export const fetchEventTypesByBand = async (bandId: BandId) => {
  try {
    const eventTypeRecords = await EventTypeModel.query(
      getEventTypesByBandQueryKey(bandId),
    ).exec();
    return eventTypeRecords.map((record) => getEventTypeFromRecord(record));
  } catch (e) {
    throw new Error(
      `Failed to fetch events types for band with id: ${bandId} with error: ${e.message}`,
    );
  }
};

const DEFAULT_EVENT_TYPES = [
  {
    name: "PRACTICE",
    color: "GREEN",
  },
  {
    name: "GIG",
    color: "BLUE",
  },
];

export const createDefaultEventTypesForBand = async (bandId: BandId) => {
  try {
    const eventTypeCreateInputs = DEFAULT_EVENT_TYPES.map((eventType) => ({
      ...eventType,
      bandId,
    }));
    return createEventTypes(eventTypeCreateInputs);
  } catch (e) {
    throw new Error(
      `Failed to create default event types for band with id: ${bandId} with error: ${e.message}`,
    );
  }
};
