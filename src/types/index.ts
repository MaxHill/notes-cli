export interface INote {
  fileName: string;
  path: string;
  content: string;
}

export interface IMeeting extends GenericNote {
  title?: string | undefined;
  notes?: string | undefined;
}

interface GenericNote {
  [key: string]: string | undefined;
}
