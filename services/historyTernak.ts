import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  createHistoryTernak,
  deleteHistoryTernak,
  getAllHistoryTernak,
  updateHistoryTernak,
} from '@/db/history/action'
import { FormSchemaType, SelectHistoryTernak } from '@/db/history/schema'
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

export function useUpdateHistoryTernak(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: Partial<
        Omit<SelectHistoryTernak, 'id' | 'createdAt' | 'updatedAt'>
      >,
    ) => updateHistoryTernak(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ['ternak'] })

      toast.success('History ternak berhasil diperbarui')
    },
    onError: (error) => {
      toast.error('Gagal memperbarui history ternak')
      console.error('Error updating ternak:', error)
    },
  })
}

export function useDeleteHistoryTernak() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (historyId: number) => deleteHistoryTernak(historyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ['ternak'] })

      toast.success('History ternak berhasil dihapus')
    },
    onError: (error) => {
      toast.error('Gagal menhapus hitory ternak')
      console.error('Error deleting history ternak', error)
    },
  })
}
