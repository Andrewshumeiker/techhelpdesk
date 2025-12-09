/**
 * Estados posibles para un ticket.  La transición debe seguir la secuencia:
 * ABIERTO → EN_PROGRESO → RESUELTO → CERRADO.
 */
export enum TicketStatus {
  ABIERTO = 'abierto',
  EN_PROGRESO = 'en_progreso',
  RESUELTO = 'resuelto',
  CERRADO = 'cerrado',
}