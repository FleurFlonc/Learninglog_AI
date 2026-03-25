import { supabase } from '@/lib/supabase/client'
import type { LearningSession, CreateSessionInput, UpdateSessionInput } from '@/models/session'
import type { TeamUser } from '@/models/user'
import type { AIToolType, TaskType, SessionStatus, ProblemCategory, ResolutionType } from '@/models/enums'
import type { Database } from '@/lib/supabase/types'

type SessionRow = Database['public']['Tables']['sessions']['Row']

export interface SessionFilters {
  status?: SessionStatus
  aiTool?: AIToolType
  taskType?: TaskType
  userId?: string
  isFavorite?: boolean
}

function rowToSession(row: SessionRow): LearningSession {
  return {
    id: row.id,
    userId: row.user_id,
    userDisplayName: row.user_display_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    taskDescription: row.task_description,
    status: row.status as SessionStatus,
    lessonLearned: row.lesson_learned,
    whatWentWrong: row.what_went_wrong ?? undefined,
    resolution: row.resolution ?? undefined,
    reflectionNotes: row.reflection_notes ?? undefined,
    aiTools: (row.ai_tools as AIToolType[] | null) ?? undefined,
    taskType: (row.task_type as TaskType | null) ?? undefined,
    problemCategory: (row.problem_category as ProblemCategory | null) ?? undefined,
    resolutionType: (row.resolution_type as ResolutionType | null) ?? undefined,
    durationMinutes: row.duration_minutes ?? undefined,
    promptGoal: row.prompt_goal ?? undefined,
    systemPrompt: row.system_prompt ?? undefined,
    userPrompt: row.user_prompt ?? undefined,
    promptOutput: row.prompt_output ?? undefined,
    improvedPrompt: row.improved_prompt ?? undefined,
    promptId: row.prompt_id ?? undefined,
    isFavorite: row.is_favorite ?? undefined,
    tags: row.tags ?? undefined,
  }
}

export const sessionService = {
  async createSession(
    input: CreateSessionInput,
    user: TeamUser
  ): Promise<LearningSession> {
    const { data, error } = await supabase
      .from('sessions')
      .insert({
        user_id: user.id,
        user_display_name: user.displayName,
        task_description: input.taskDescription,
        status: input.status,
        lesson_learned: input.lessonLearned,
        what_went_wrong: input.whatWentWrong ?? null,
        resolution: input.resolution ?? null,
        reflection_notes: input.reflectionNotes ?? null,
        ai_tools: (input.aiTools as string[] | undefined) ?? null,
        task_type: input.taskType ?? null,
        problem_category: input.problemCategory ?? null,
        resolution_type: input.resolutionType ?? null,
        duration_minutes: input.durationMinutes ?? null,
        prompt_goal: input.promptGoal ?? null,
        system_prompt: input.systemPrompt ?? null,
        user_prompt: input.userPrompt ?? null,
        prompt_output: input.promptOutput ?? null,
        improved_prompt: input.improvedPrompt ?? null,
        prompt_id: input.promptId ?? null,
        is_favorite: input.isFavorite ?? false,
        tags: input.tags ?? null,
      } satisfies Database['public']['Tables']['sessions']['Insert'])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return rowToSession(data as SessionRow)
  },

  async updateSession(input: UpdateSessionInput): Promise<LearningSession> {
    const { id, ...fields } = input

    const updateData: Database['public']['Tables']['sessions']['Update'] = {
      ...(fields.taskDescription !== undefined && { task_description: fields.taskDescription }),
      ...(fields.status !== undefined && { status: fields.status }),
      ...(fields.lessonLearned !== undefined && { lesson_learned: fields.lessonLearned }),
      ...(fields.whatWentWrong !== undefined && { what_went_wrong: fields.whatWentWrong }),
      ...(fields.resolution !== undefined && { resolution: fields.resolution }),
      ...(fields.reflectionNotes !== undefined && { reflection_notes: fields.reflectionNotes }),
      ...(fields.aiTools !== undefined && { ai_tools: fields.aiTools as string[] }),
      ...(fields.taskType !== undefined && { task_type: fields.taskType }),
      ...(fields.problemCategory !== undefined && { problem_category: fields.problemCategory }),
      ...(fields.resolutionType !== undefined && { resolution_type: fields.resolutionType }),
      ...(fields.durationMinutes !== undefined && { duration_minutes: fields.durationMinutes }),
      ...(fields.promptGoal !== undefined && { prompt_goal: fields.promptGoal }),
      ...(fields.systemPrompt !== undefined && { system_prompt: fields.systemPrompt }),
      ...(fields.userPrompt !== undefined && { user_prompt: fields.userPrompt }),
      ...(fields.promptOutput !== undefined && { prompt_output: fields.promptOutput }),
      ...(fields.improvedPrompt !== undefined && { improved_prompt: fields.improvedPrompt }),
      ...(fields.promptId !== undefined && { prompt_id: fields.promptId }),
      ...(fields.isFavorite !== undefined && { is_favorite: fields.isFavorite }),
      ...(fields.tags !== undefined && { tags: fields.tags }),
      ...(fields.userDisplayName !== undefined && { user_display_name: fields.userDisplayName }),
    }

    const { data, error } = await supabase
      .from('sessions')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return rowToSession(data as SessionRow)
  },

  async deleteSession(id: string): Promise<void> {
    const { error } = await supabase.from('sessions').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },

  async getSessionById(id: string): Promise<LearningSession | undefined> {
    const { data, error } = await supabase
      .from('sessions')
      .select()
      .eq('id', id)
      .single()

    if (error) return undefined
    return rowToSession(data as SessionRow)
  },

  async getAllSessions(): Promise<LearningSession[]> {
    const { data, error } = await supabase
      .from('sessions')
      .select()
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as SessionRow[]).map(rowToSession)
  },

  async searchSessions(query: string): Promise<LearningSession[]> {
    const { data, error } = await supabase
      .from('sessions')
      .select()
      .or(
        `task_description.ilike.%${query}%,lesson_learned.ilike.%${query}%,what_went_wrong.ilike.%${query}%`
      )
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as SessionRow[]).map(rowToSession)
  },

  async filterSessions(filters: SessionFilters): Promise<LearningSession[]> {
    let query = supabase.from('sessions').select()

    if (filters.status) query = query.eq('status', filters.status)
    if (filters.taskType) query = query.eq('task_type', filters.taskType)
    if (filters.userId) query = query.eq('user_id', filters.userId)
    if (filters.isFavorite !== undefined)
      query = query.eq('is_favorite', filters.isFavorite)
    if (filters.aiTool)
      query = query.contains('ai_tools', [filters.aiTool])

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as SessionRow[]).map(rowToSession)
  },

  async getMySessions(): Promise<LearningSession[]> {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) throw new Error('Niet ingelogd')

    const { data, error } = await supabase
      .from('sessions')
      .select()
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as SessionRow[]).map(rowToSession)
  },
}
