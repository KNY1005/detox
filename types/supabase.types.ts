export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4";
  };
  public: {
    Tables: {
      AnalysisResult: {
        Row: {
          analysis_type: string;
          created_at: string;
          id: string;
          result_data: Json | null;
          result_summary: string;
          target_id: string | null;
          user_id: string;
        };
        Insert: {
          analysis_type: string;
          created_at?: string;
          id?: string;
          result_data?: Json | null;
          result_summary: string;
          target_id?: string | null;
          user_id: string;
        };
        Update: {
          analysis_type?: string;
          created_at?: string;
          id?: string;
          result_data?: Json | null;
          result_summary?: string;
          target_id?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "AnalysisResult_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      comment: {
        Row: {
          content: string;
          created_at: string;
          deleted_at: string | null;
          id: string;
          post_id: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          post_id: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          post_id?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Comment_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "post";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Comment_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      likes: {
        Row: {
          created_at: string;
          id: string;
          post_id: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          post_id: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          post_id?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "PostLike_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "post";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "PostLike_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      notification: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          id: string;
          is_read: boolean;
          message: string;
          post_id: string | null;
          read_at: string | null;
          subscription_id: string | null;
          title: string;
          type: Database["public"]["Enums"]["NOTIFICATION_TYPE"];
          user_id: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          is_read?: boolean;
          message: string;
          post_id?: string | null;
          read_at?: string | null;
          subscription_id?: string | null;
          title: string;
          type: Database["public"]["Enums"]["NOTIFICATION_TYPE"];
          user_id: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          is_read?: boolean;
          message?: string;
          post_id?: string | null;
          read_at?: string | null;
          subscription_id?: string | null;
          title?: string;
          type?: Database["public"]["Enums"]["NOTIFICATION_TYPE"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Notification_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "post";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Notification_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "subscription";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Notification_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      notification_settings: {
        Row: {
          created_at: string;
          id: string;
          is_community_alert_enabled: boolean;
          is_subscription_alert_enabled: boolean;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_community_alert_enabled: boolean;
          is_subscription_alert_enabled: boolean;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_community_alert_enabled?: boolean;
          is_subscription_alert_enabled?: boolean;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "NotificationSetting_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      payment_history: {
        Row: {
          amount: number;
          billing_month: string;
          created_at: string;
          id: string;
          paid_at: string;
          paid_for_end: string | null;
          paid_for_start: string | null;
          status: string;
          subscription_id: string;
        };
        Insert: {
          amount: number;
          billing_month: string;
          created_at?: string;
          id?: string;
          paid_at: string;
          paid_for_end?: string | null;
          paid_for_start?: string | null;
          status: string;
          subscription_id: string;
        };
        Update: {
          amount?: number;
          billing_month?: string;
          created_at?: string;
          id?: string;
          paid_at?: string;
          paid_for_end?: string | null;
          paid_for_start?: string | null;
          status?: string;
          subscription_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "PaymentHistory_subscription_id_fkey";
            columns: ["subscription_id"];
            isOneToOne: false;
            referencedRelation: "subscription";
            referencedColumns: ["id"];
          },
        ];
      };
      post: {
        Row: {
          content: string;
          created_at: string;
          deleted_at: string | null;
          id: string;
          service: string;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          content: string;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          service: string;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          content?: string;
          created_at?: string;
          deleted_at?: string | null;
          id?: string;
          service?: string;
          title?: string;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Post_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      report: {
        Row: {
          comment_id: string | null;
          created_at: string;
          id: string;
          post_id: string | null;
          reporter_user_id: string;
        };
        Insert: {
          comment_id?: string | null;
          created_at?: string;
          id?: string;
          post_id?: string | null;
          reporter_user_id: string;
        };
        Update: {
          comment_id?: string | null;
          created_at?: string;
          id?: string;
          post_id?: string | null;
          reporter_user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Report_comment_id_fkey";
            columns: ["comment_id"];
            isOneToOne: false;
            referencedRelation: "comment";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Report_post_id_fkey";
            columns: ["post_id"];
            isOneToOne: false;
            referencedRelation: "post";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "Report_reporter_user_id_fkey";
            columns: ["reporter_user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      subscription: {
        Row: {
          billing_cycle: Database["public"]["Enums"]["BILLING_CYCLE"];
          created_at: string;
          end_date: string | null;
          id: string;
          member_count: number;
          next_payment_date: string | null;
          payment_day: number | null;
          payment_type: Database["public"]["Enums"]["PAYMENT_TYPE"];
          service: string;
          start_date: string | null;
          status: Database["public"]["Enums"]["SUBSCRIPTION_STATUS"];
          subscription_mode: Database["public"]["Enums"]["SUBSCRIPTION_MODE"];
          total_amount: number;
          trial_months: number | null;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          billing_cycle: Database["public"]["Enums"]["BILLING_CYCLE"];
          created_at?: string;
          end_date?: string | null;
          id?: string;
          member_count: number;
          next_payment_date?: string | null;
          payment_day?: number | null;
          payment_type: Database["public"]["Enums"]["PAYMENT_TYPE"];
          service: string;
          start_date?: string | null;
          status: Database["public"]["Enums"]["SUBSCRIPTION_STATUS"];
          subscription_mode: Database["public"]["Enums"]["SUBSCRIPTION_MODE"];
          total_amount: number;
          trial_months?: number | null;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          billing_cycle?: Database["public"]["Enums"]["BILLING_CYCLE"];
          created_at?: string;
          end_date?: string | null;
          id?: string;
          member_count?: number;
          next_payment_date?: string | null;
          payment_day?: number | null;
          payment_type?: Database["public"]["Enums"]["PAYMENT_TYPE"];
          service?: string;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["SUBSCRIPTION_STATUS"];
          subscription_mode?: Database["public"]["Enums"]["SUBSCRIPTION_MODE"];
          total_amount?: number;
          trial_months?: number | null;
          updated_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "Subscription_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string;
          deleted_at: string | null;
          email: string | null;
          id: string;
          is_anonymous: boolean;
          nickname: string | null;
          profile_image: string | null;
          provider: string;
          provider_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          deleted_at?: string | null;
          email?: string | null;
          id?: string;
          is_anonymous: boolean;
          nickname?: string | null;
          profile_image?: string | null;
          provider: string;
          provider_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          deleted_at?: string | null;
          email?: string | null;
          id?: string;
          is_anonymous?: boolean;
          nickname?: string | null;
          profile_image?: string | null;
          provider?: string;
          provider_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      toggle_post_like: {
        Args: { p_post_id: string; p_user_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      BILLING_CYCLE: "monthly" | "yearly";
      NOTIFICATION_TYPE:
        | "payment_due"
        | "trial_ending"
        | "community_comment"
        | "community_like";
      PAYMENT_TYPE: "paid" | "trial";
      SUBSCRIPTION_MODE: "solo" | "group";
      SUBSCRIPTION_STATUS: "active" | "ended" | "canceled";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      BILLING_CYCLE: ["monthly", "yearly"],
      NOTIFICATION_TYPE: [
        "payment_due",
        "trial_ending",
        "community_comment",
        "community_like",
      ],
      PAYMENT_TYPE: ["paid", "trial"],
      SUBSCRIPTION_MODE: ["solo", "group"],
      SUBSCRIPTION_STATUS: ["active", "ended", "canceled"],
    },
  },
} as const;
