export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      backlogs: {
        Row: {
          action: string | null;
          created_at: string;
          event: string | null;
          id: string;
        };
        Insert: {
          action?: string | null;
          created_at?: string;
          event?: string | null;
          id?: string;
        };
        Update: {
          action?: string | null;
          created_at?: string;
          event?: string | null;
          id?: string;
        };
        Relationships: [];
      };
      booked_rooms: {
        Row: {
          course_and_section: string | null;
          created_at: string;
          date: string | null;
          id: string;
          profile_id: string | null;
          room_id: string | null;
          status: string | null;
          subject_code: string | null;
          time_in: string | null;
          time_out: string | null;
        };
        Insert: {
          course_and_section?: string | null;
          created_at?: string;
          date?: string | null;
          id?: string;
          profile_id?: string | null;
          room_id?: string | null;
          status?: string | null;
          subject_code?: string | null;
          time_in?: string | null;
          time_out?: string | null;
        };
        Update: {
          course_and_section?: string | null;
          created_at?: string;
          date?: string | null;
          id?: string;
          profile_id?: string | null;
          room_id?: string | null;
          status?: string | null;
          subject_code?: string | null;
          time_in?: string | null;
          time_out?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "booked_rooms_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "booked_rooms_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
        ];
      };
      building: {
        Row: {
          building_name: string | null;
          created_at: string;
          id: string;
        };
        Insert: {
          building_name?: string | null;
          created_at?: string;
          id?: string;
        };
        Update: {
          building_name?: string | null;
          created_at?: string;
          id?: string;
        };
        Relationships: [];
      };
      course: {
        Row: {
          course_name: string | null;
          created_at: string;
          id: string;
        };
        Insert: {
          course_name?: string | null;
          created_at?: string;
          id?: string;
        };
        Update: {
          course_name?: string | null;
          created_at?: string;
          id?: string;
        };
        Relationships: [];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          user_id: string | null;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          email: string | null;
          "expo-push-token": string | null;
          full_name: string | null;
          id: string;
          is_archived: boolean | null;
          mobile_number: string | null;
          updated_at: string | null;
          user_department: string | null;
          user_role: string | null;
          username: string | null;
          website: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          email?: string | null;
          "expo-push-token"?: string | null;
          full_name?: string | null;
          id: string;
          is_archived?: boolean | null;
          mobile_number?: string | null;
          updated_at?: string | null;
          user_department?: string | null;
          user_role?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          email?: string | null;
          "expo-push-token"?: string | null;
          full_name?: string | null;
          id?: string;
          is_archived?: boolean | null;
          mobile_number?: string | null;
          updated_at?: string | null;
          user_department?: string | null;
          user_role?: string | null;
          username?: string | null;
          website?: string | null;
        };
        Relationships: [];
      };
      rooms: {
        Row: {
          building_id: string | null;
          created_at: string;
          id: string;
          is_archived: boolean | null;
          room_capacity: number | null;
          room_image: string | null;
          room_name: string | null;
          room_type: string | null;
        };
        Insert: {
          building_id?: string | null;
          created_at?: string;
          id?: string;
          is_archived?: boolean | null;
          room_capacity?: number | null;
          room_image?: string | null;
          room_name?: string | null;
          room_type?: string | null;
        };
        Update: {
          building_id?: string | null;
          created_at?: string;
          id?: string;
          is_archived?: boolean | null;
          room_capacity?: number | null;
          room_image?: string | null;
          room_name?: string | null;
          room_type?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "rooms_building_id_fkey";
            columns: ["building_id"];
            isOneToOne: false;
            referencedRelation: "building";
            referencedColumns: ["id"];
          },
        ];
      };
      schedule: {
        Row: {
          course_id: string | null;
          created_at: string;
          days: string | null;
          id: string;
          profile_id: string | null;
          room_id: string | null;
          status: string | null;
          subject_id: string | null;
          time_in: string | null;
          time_out: string | null;
          timef_in: string | null;
          timef_out: string | null;
        };
        Insert: {
          course_id?: string | null;
          created_at?: string;
          days?: string | null;
          id?: string;
          profile_id?: string | null;
          room_id?: string | null;
          status?: string | null;
          subject_id?: string | null;
          time_in?: string | null;
          time_out?: string | null;
          timef_in?: string | null;
          timef_out?: string | null;
        };
        Update: {
          course_id?: string | null;
          created_at?: string;
          days?: string | null;
          id?: string;
          profile_id?: string | null;
          room_id?: string | null;
          status?: string | null;
          subject_id?: string | null;
          time_in?: string | null;
          time_out?: string | null;
          timef_in?: string | null;
          timef_out?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "schedule_course_id_fkey";
            columns: ["course_id"];
            isOneToOne: false;
            referencedRelation: "course";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedule_profile_id_fkey";
            columns: ["profile_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedule_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "schedule_subject_id_fkey";
            columns: ["subject_id"];
            isOneToOne: false;
            referencedRelation: "subject";
            referencedColumns: ["id"];
          },
        ];
      };
      subject: {
        Row: {
          created_at: string;
          id: string;
          subject_code: string | null;
          subject_name: string | null;
          unit_lab: number | null;
          unit_lecture: number | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          subject_code?: string | null;
          subject_name?: string | null;
          unit_lab?: number | null;
          unit_lecture?: number | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          subject_code?: string | null;
          subject_name?: string | null;
          unit_lab?: number | null;
          unit_lecture?: number | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (
      & Database[PublicTableNameOrOptions["schema"]]["Tables"]
      & Database[PublicTableNameOrOptions["schema"]]["Views"]
    )
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database } ? (
    & Database[PublicTableNameOrOptions["schema"]]["Tables"]
    & Database[PublicTableNameOrOptions["schema"]]["Views"]
  )[TableName] extends {
    Row: infer R;
  } ? R
  : never
  : PublicTableNameOrOptions extends keyof (
    & PublicSchema["Tables"]
    & PublicSchema["Views"]
  ) ? (
      & PublicSchema["Tables"]
      & PublicSchema["Views"]
    )[PublicTableNameOrOptions] extends {
      Row: infer R;
    } ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  } ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    } ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  } ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    } ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]][
      "CompositeTypes"
    ]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][
    CompositeTypeName
  ]
  : PublicCompositeTypeNameOrOptions extends
    keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
