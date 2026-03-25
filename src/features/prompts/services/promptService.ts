import { supabase } from '@/lib/supabase/client'
import type { PromptEntry, CreatePromptInput, UpdatePromptInput } from '@/models/prompt'
import type { TeamUser } from '@/models/user'
import type { AIToolType, TaskType } from '@/models/enums'
import type { Database } from '@/lib/supabase/types'

type PromptRow = Database['public']['Tables']['prompts']['Row']

export interface PromptFilters {
  aiTool?: AIToolType
  taskType?: TaskType
  userId?: string
  isFavorite?: boolean
  minRating?: number
}

function rowToPrompt(row: PromptRow): PromptEntry {
  return {
    id: row.id,
    userId: row.user_id,
    userDisplayName: row.user_display_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    title: row.title,
    aiTools: row.ai_tools as AIToolType[],
    taskType: (row.task_type as TaskType | null) ?? undefined,
    goalSummary: row.goal_summary,
    goalFull: row.goal_full ?? undefined,
    systemPromptSummary: row.system_prompt_summary ?? undefined,
    systemPromptFull: row.system_prompt_full ?? undefined,
    userPromptSummary: row.user_prompt_summary,
    userPromptFull: row.user_prompt_full ?? undefined,
    outputSummary: row.output_summary ?? undefined,
    outputFull: row.output_full ?? undefined,
    promptRating: row.prompt_rating ?? undefined,
    sessionId: row.session_id ?? undefined,
    isFavorite: row.is_favorite ?? undefined,
    tags: row.tags ?? undefined,
  }
}

export const promptService = {
  async createPrompt(
    input: CreatePromptInput,
    user: TeamUser
  ): Promise<PromptEntry> {
    const { data, error } = await supabase
      .from('prompts')
      .insert({
        user_id: user.id,
        user_display_name: user.displayName,
        title: input.title,
        ai_tools: input.aiTools as string[],
        task_type: input.taskType ?? null,
        goal_summary: input.goalSummary,
        goal_full: input.goalFull ?? null,
        system_prompt_summary: input.systemPromptSummary ?? null,
        system_prompt_full: input.systemPromptFull ?? null,
        user_prompt_summary: input.userPromptSummary,
        user_prompt_full: input.userPromptFull ?? null,
        output_summary: input.outputSummary ?? null,
        output_full: input.outputFull ?? null,
        prompt_rating: input.promptRating ?? null,
        session_id: input.sessionId ?? null,
        is_favorite: input.isFavorite ?? false,
        tags: input.tags ?? null,
      } satisfies Database['public']['Tables']['prompts']['Insert'])
      .select()
      .single()

    if (error) throw new Error(error.message)
    return rowToPrompt(data as PromptRow)
  },

  async updatePrompt(input: UpdatePromptInput): Promise<PromptEntry> {
    const { id, ...fields } = input

    const updateData: Database['public']['Tables']['prompts']['Update'] = {
      ...(fields.title !== undefined && { title: fields.title }),
      ...(fields.aiTools !== undefined && { ai_tools: fields.aiTools as string[] }),
      ...(fields.taskType !== undefined && { task_type: fields.taskType }),
      ...(fields.goalSummary !== undefined && { goal_summary: fields.goalSummary }),
      ...(fields.goalFull !== undefined && { goal_full: fields.goalFull }),
      ...(fields.systemPromptSummary !== undefined && {
        system_prompt_summary: fields.systemPromptSummary,
      }),
      ...(fields.systemPromptFull !== undefined && {
        system_prompt_full: fields.systemPromptFull,
      }),
      ...(fields.userPromptSummary !== undefined && {
        user_prompt_summary: fields.userPromptSummary,
      }),
      ...(fields.userPromptFull !== undefined && {
        user_prompt_full: fields.userPromptFull,
      }),
      ...(fields.outputSummary !== undefined && { output_summary: fields.outputSummary }),
      ...(fields.outputFull !== undefined && { output_full: fields.outputFull }),
      ...(fields.promptRating !== undefined && { prompt_rating: fields.promptRating }),
      ...(fields.sessionId !== undefined && { session_id: fields.sessionId }),
      ...(fields.isFavorite !== undefined && { is_favorite: fields.isFavorite }),
      ...(fields.tags !== undefined && { tags: fields.tags }),
      ...(fields.userDisplayName !== undefined && {
        user_display_name: fields.userDisplayName,
      }),
    }

    const { data, error } = await supabase
      .from('prompts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return rowToPrompt(data as PromptRow)
  },

  async deletePrompt(id: string): Promise<void> {
    const { error } = await supabase.from('prompts').delete().eq('id', id)
    if (error) throw new Error(error.message)
  },

  async getPromptById(id: string): Promise<PromptEntry | undefined> {
    const { data, error } = await supabase
      .from('prompts')
      .select()
      .eq('id', id)
      .single()

    if (error) return undefined
    return rowToPrompt(data as PromptRow)
  },

  async getAllPrompts(): Promise<PromptEntry[]> {
    const { data, error } = await supabase
      .from('prompts')
      .select()
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as PromptRow[]).map(rowToPrompt)
  },

  async searchPrompts(query: string): Promise<PromptEntry[]> {
    const { data, error } = await supabase
      .from('prompts')
      .select()
      .or(
        `title.ilike.%${query}%,goal_summary.ilike.%${query}%,user_prompt_summary.ilike.%${query}%`
      )
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as PromptRow[]).map(rowToPrompt)
  },

  async filterPrompts(filters: PromptFilters): Promise<PromptEntry[]> {
    let query = supabase.from('prompts').select()

    if (filters.taskType) query = query.eq('task_type', filters.taskType)
    if (filters.userId) query = query.eq('user_id', filters.userId)
    if (filters.isFavorite !== undefined)
      query = query.eq('is_favorite', filters.isFavorite)
    if (filters.minRating !== undefined)
      query = query.gte('prompt_rating', filters.minRating)
    if (filters.aiTool)
      query = query.contains('ai_tools', [filters.aiTool])

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as PromptRow[]).map(rowToPrompt)
  },

  async getMyPrompts(): Promise<PromptEntry[]> {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) throw new Error('Niet ingelogd')

    const { data, error } = await supabase
      .from('prompts')
      .select()
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return (data as PromptRow[]).map(rowToPrompt)
  },
}
