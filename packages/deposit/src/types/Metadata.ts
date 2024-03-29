import type { Language, LanguageStrings, RecursiveOmit } from '@dans-framework/utils';
import type { Field, InputField, GroupedFieldType } from './MetadataFields';
import type { Target } from '@dans-framework/user-auth';

// Accordion sections
export interface InitialSectionType {
  id: string;
  title: string | LanguageStrings;
  fields: RecursiveOmit<Field, 'id'>[];
}

export type SectionStatus = 'error' | 'warning' | 'success' | undefined;

export interface SectionType extends Omit<InitialSectionType, 'fields'> {
  fields: Field[];
  status: SectionStatus;
}

export interface InitialStateType {
  id: string;
  form: SectionType[];
  panel: string;
  tab: number;
}

export interface InitialFormType {
  metadata: SectionType[];
  id?: string;
  'file-metadata'?: any;
}

export interface FormConfig {
  form: InitialSectionType[];
  target: Target[];
  submitKey?: string;
  skipValidation?: boolean;
  geonamesApiKey?: string;
  gsheetsApiKey?: string;
}