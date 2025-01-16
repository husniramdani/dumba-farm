import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  createTernak,
  deleteTernak,
  getAllTernak,
  getTernakById,
  jualTernak,
  updateTernak,
} from '@/db/ternak/action'
import { FormSchemaType, SelectTernak } from '@/db/ternak/schema'
import { PaginationParams } from '@/types/model'

const QUERY_KEY = 'ternak' as const

export function useTernak(params: PaginationParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getAllTernak(params),
  })
}

export function useTernakDetail(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getTernakById(id),
  })
}

export function useCreateTernak() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FormSchemaType) => createTernak(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Ternak berhasil ditambahkan')
    },
    onError: (error) => {
      toast.error('Gagal menambahkan ternak')
      console.error('Error creating ternak:', error)
    },
  })
}

export function useUpdateTernak(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: Partial<Omit<SelectTernak, 'id' | 'createdAt' | 'updatedAt'>>,
    ) => updateTernak(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Ternak berhasil diperbarui')
    },
    onError: (error) => {
      toast.error('Gagal memperbarui ternak')
      console.error('Error updating ternak:', error)
    },
  })
}

export function useDeleteTernak() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ternakId: number) => deleteTernak(ternakId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Ternak berhasil dihapus')
    },
    onError: (error) => {
      toast.error('Gagal menghapus ternak')
      console.error('Error deleting ternak:', error)
    },
  })
}

export function useJualTernak() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, price }: { id: number; price?: number }) =>
      jualTernak(id, price),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Ternak berhasil dijual')
    },
    onError: (error) => {
      toast.error('Gagal memperbarui ternak')
      console.error('Error updating ternak:', error)
    },
  })
}
