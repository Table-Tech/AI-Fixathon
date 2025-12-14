// Hulpwijzer Database Types
// Generated based on our schema - update if schema changes

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          created_at: string;
          updated_at: string;
          // Persoonlijk
          date_of_birth: string | null;
          postal_code: string | null;
          city: string | null;
          // Gezinssituatie
          number_of_children: number | null;
          children_ages: number[] | null;
          is_single_parent: boolean | null;
          // Financieel
          income_range: IncomeRange | null;
          employment_status: EmploymentStatus | null;
          receives_benefits: string[] | null;
          // Wonen
          housing_type: HousingType | null;
          monthly_rent: number | null;
          // Eligibility
          has_dutch_residence: boolean | null;
          has_health_insurance: boolean | null;
          has_debts: boolean | null;
          savings_under_limit: boolean | null;
        };
        Insert: {
          id: string;
          email: string;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
          date_of_birth?: string | null;
          postal_code?: string | null;
          city?: string | null;
          number_of_children?: number | null;
          children_ages?: number[] | null;
          is_single_parent?: boolean | null;
          income_range?: IncomeRange | null;
          employment_status?: EmploymentStatus | null;
          receives_benefits?: string[] | null;
          housing_type?: HousingType | null;
          monthly_rent?: number | null;
          has_dutch_residence?: boolean | null;
          has_health_insurance?: boolean | null;
          has_debts?: boolean | null;
          savings_under_limit?: boolean | null;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          created_at?: string;
          updated_at?: string;
          date_of_birth?: string | null;
          postal_code?: string | null;
          city?: string | null;
          number_of_children?: number | null;
          children_ages?: number[] | null;
          is_single_parent?: boolean | null;
          income_range?: IncomeRange | null;
          employment_status?: EmploymentStatus | null;
          receives_benefits?: string[] | null;
          housing_type?: HousingType | null;
          monthly_rent?: number | null;
          has_dutch_residence?: boolean | null;
          has_health_insurance?: boolean | null;
          has_debts?: boolean | null;
          savings_under_limit?: boolean | null;
        };
      };
      regelingen: {
        Row: {
          id: string;
          slug: string;
          title: string;
          eligible_for: string[];
          min_age: number | null;
          max_age: number | null;
          details: RegelingDetails;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          eligible_for?: string[];
          min_age?: number | null;
          max_age?: number | null;
          details?: RegelingDetails;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          eligible_for?: string[];
          min_age?: number | null;
          max_age?: number | null;
          details?: RegelingDetails;
          is_active?: boolean;
          created_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          regeling_id: string | null;
          title: string;
          description: string | null;
          status: TaskStatus;
          deadline: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          regeling_id?: string | null;
          title: string;
          description?: string | null;
          status?: TaskStatus;
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          regeling_id?: string | null;
          title?: string;
          description?: string | null;
          status?: TaskStatus;
          deadline?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subtasks: {
        Row: {
          id: string;
          task_id: string;
          title: string;
          is_done: boolean;
          order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          task_id: string;
          title: string;
          is_done?: boolean;
          order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          task_id?: string;
          title?: string;
          is_done?: boolean;
          order?: number;
          created_at?: string;
        };
      };
      audit_log: {
        Row: {
          id: string;
          user_id: string | null;
          action: string;
          resource_type: string | null;
          resource_id: string | null;
          details: Record<string, unknown>;
          risk_level: RiskLevel;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: string;
          resource_type?: string | null;
          resource_id?: string | null;
          details?: Record<string, unknown>;
          risk_level?: RiskLevel;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: string;
          resource_type?: string | null;
          resource_id?: string | null;
          details?: Record<string, unknown>;
          risk_level?: RiskLevel;
          created_at?: string;
        };
      };
      user_consents: {
        Row: {
          id: string;
          user_id: string;
          consent_type: string;
          granted: boolean;
          granted_at: string | null;
          revoked_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          consent_type: string;
          granted?: boolean;
          granted_at?: string | null;
          revoked_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          consent_type?: string;
          granted?: boolean;
          granted_at?: string | null;
          revoked_at?: string | null;
        };
      };
      chat_messages: {
        Row: {
          id: string;
          user_id: string | null;
          session_id: string;
          role: ChatRole;
          content: string;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          session_id: string;
          role: ChatRole;
          content: string;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          session_id?: string;
          role?: ChatRole;
          content?: string;
          metadata?: Record<string, unknown>;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};

// Custom types for better DX
export type TaskStatus = "pending" | "in_progress" | "completed";
export type RiskLevel = "low" | "medium" | "high";
export type ChatRole = "user" | "assistant";
export type IncomeRange = "low" | "middle" | "high";
export type EmploymentStatus = "employed" | "unemployed" | "self_employed" | "student" | "retired";
export type HousingType = "rent" | "own";

export interface RegelingDetails {
  description: string;
  short_description?: string;
  category: "income" | "housing" | "childcare" | "healthcare" | "other";
  requirements: string[];
  documents_needed: string[];
  source_url: string;
  provider: string;
  how_to_apply: string;
  estimated_amount?: string;
  impact_score?: number;
}

// Helper types for common use cases
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Regeling = Database["public"]["Tables"]["regelingen"]["Row"];
export type Task = Database["public"]["Tables"]["tasks"]["Row"];
export type Subtask = Database["public"]["Tables"]["subtasks"]["Row"];
export type AuditLog = Database["public"]["Tables"]["audit_log"]["Row"];
export type UserConsent = Database["public"]["Tables"]["user_consents"]["Row"];
export type ChatMessage = Database["public"]["Tables"]["chat_messages"]["Row"];

// Task with subtasks for API responses
export interface TaskWithSubtasks extends Task {
  subtasks: Subtask[];
  regeling?: Regeling | null;
}
