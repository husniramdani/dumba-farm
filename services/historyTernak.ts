import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { createHistoryTernak, getAllHistoryTernak } from '@/db/history/action'
import { FormSchemaType } from '@/db/history/schema'
import { PaginationParams } from '@/types/model'

export interface HistoryTernakParams extends PaginationParams {
  ternakId?: number
}

const QUERY_KEY = 'historyTernak' as const

export function useHistoryTernak(params: HistoryTernakParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getAllHistoryTernak(params),
  })
}

export function useCreateHistoryTernak() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FormSchemaType) => createHistoryTernak(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Berat ternak berhasil diperbarui')
    },
    onError: (error) => {
      toast.error('Gagal memperbarui berat')
      console.error('Error update berat:', error)
    },
  })
}
