// Mirrors supabase/migrations. Once the Supabase project is linked, regenerate with:
//   npx supabase gen types typescript --linked > packages/shared/src/db/database.types.ts

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      lists: {
        Row: { id: string; user_id: string; name: string; is_favorites: boolean; created_at: string };
        Insert: { id?: string; user_id?: string; name: string; is_favorites?: boolean; created_at?: string };
        Update: { id?: string; user_id?: string; name?: string; is_favorites?: boolean; created_at?: string };
        Relationships: [];
      };
      list_items: {
        Row: { list_id: string; product_id: string; created_at: string };
        Insert: { list_id: string; product_id: string; created_at?: string };
        Update: { list_id?: string; product_id?: string; created_at?: string };
        Relationships: [
          {
            foreignKeyName: "list_items_list_id_fkey";
            columns: ["list_id"];
            isOneToOne: false;
            referencedRelation: "lists";
            referencedColumns: ["id"];
          },
        ];
      };
      trips: {
        Row: { id: string; user_id: string; name: string; template_id: string | null; created_at: string };
        Insert: { id?: string; user_id?: string; name: string; template_id?: string | null; created_at?: string };
        Update: { id?: string; user_id?: string; name?: string; template_id?: string | null; created_at?: string };
        Relationships: [];
      };
      trip_items: {
        Row: {
          id: string;
          trip_id: string;
          label: string;
          section: string;
          product_slug: string | null;
          gear_category: string | null;
          gear_subcategory: string | null;
          checked: boolean;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          label: string;
          section: string;
          product_slug?: string | null;
          gear_category?: string | null;
          gear_subcategory?: string | null;
          checked?: boolean;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          label?: string;
          section?: string;
          product_slug?: string | null;
          gear_category?: string | null;
          gear_subcategory?: string | null;
          checked?: boolean;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trip_items_trip_id_fkey";
            columns: ["trip_id"];
            isOneToOne: false;
            referencedRelation: "trips";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      delete_account: { Args: never; Returns: undefined };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
