import shortid from "shortid";
import {
  EventDocument,
  EventModel,
  getEventsByBandQueryKey,
  getEventByIdKey,
} from "../db";
import type { EventCreateInput, Event, BandId } from "./types";

const getEventFromRecord = (eventRecord: EventDocument): Event => ({
  bandId: eventRecord.pk,
  id: eventRecord.sk,
  name: eventRecord.eventName,
  type: eventRecord.eventType,
  paid: eventRecord.eventIsPaid,
  date: eventRecord.eventDate,
  time: eventRecord.eventTime,
});

const getEventFromCreateInput = (createInput: EventCreateInput): Event => ({
  id: shortid.generate(),
  ...createInput,
});

const getRecordFromEvent = (model: Event): EventDocument => new EventModel({
  pk: model.bandId,
  sk: model.id,
  eventName: model.name,
  eventType: model.type,
  eventIsPaid: model.paid,
  eventDate: model.date,
  eventTime: model.time,
});

export const createEvent = async (
  createInput: EventCreateInput,
): Promise<Event> => {
  try {
    const event = getEventFromCreateInput(createInput);
    const eventRecord = getRecordFromEvent(event);
    await eventRecord.save();
    return event;
  } catch (e) {
    throw new Error(`Failed to create event with name: ${createInput.name}`);
  }
};

export const fetchEventsByBand = async (bandId: BandId) => {
  try {
    const eventRecords = await EventModel.query(
      getEventsByBandQueryKey(bandId),
    ).exec();
    return eventRecords.map((record) => getEventFromRecord(record));
  } catch (e) {
    throw new Error(`Failed to fetch events for band with id: ${bandId}`);
  }
};
