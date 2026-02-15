/**
 * Google Calendar API - criação de evento pós-pagamento do agendamento.
 * Configure GOOGLE_CALENDAR_ENABLED=true e credenciais OAuth em env.
 */

export interface CalendarEventInput {
  summary: string;
  description: string;
  start: Date;
  end: Date;
  attendeeEmail?: string;
}

export const GoogleCalendarService = {
  async createEvent(input: CalendarEventInput): Promise<string | null> {
    try {
      if (process.env.GOOGLE_CALENDAR_ENABLED !== "true") return null;
      const token = process.env.GOOGLE_CALENDAR_ACCESS_TOKEN;
      if (!token) {
        console.warn("[GoogleCalendar] GOOGLE_CALENDAR_ACCESS_TOKEN não definido");
        return null;
      }
      const calendarId = process.env.GOOGLE_CALENDAR_ID ?? "primary";
      const body = {
        summary: input.summary,
        description: input.description,
        start: { dateTime: input.start.toISOString(), timeZone: "America/Sao_Paulo" },
        end: { dateTime: input.end.toISOString(), timeZone: "America/Sao_Paulo" },
        attendees: input.attendeeEmail ? [{ email: input.attendeeEmail }] : undefined,
      };
      const res = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        const err = await res.text();
        console.error("[GoogleCalendar]", res.status, err);
        return null;
      }
      const data = (await res.json()) as { id: string };
      return data.id ?? null;
    } catch (err) {
      console.error("[GoogleCalendar]", err);
      return null;
    }
  },
};
