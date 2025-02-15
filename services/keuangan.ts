import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import {
  createKeuangan,
  deleteKeuangan,
  getAllKeuangan,
  getKeuanganById,
  updateKeuangan,
} from '@/db/keuangan/action'
import { FormSchemaType, SelectKeuangan } from '@/db/keuangan/schema'
import { PaginationParams } from '@/types/model'

const QUERY_KEY = 'keuangan' as const

export function useKeuangan(params: PaginationParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEY, params],
    queryFn: () => getAllKeuangan(params),
  })
}

export function useKeuanganDetail(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getKeuanganById(id),
  })
}

export function useCreateKeuangan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FormSchemaType) => createKeuangan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Transaksi berhasil ditambahkan')
    },
    onError: (error) => {
      toast.error('Gagal menambahkan transaksi')
      console.error('Error creating transaction:', error)
    },
  })
}

export function useUpdateKeuangan(id: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: Partial<Omit<SelectKeuangan, 'id' | 'createdAt' | 'updatedAt'>>,
    ) => updateKeuangan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Transaksi berhasil diperbarui')
    },
    onError: (error) => {
      toast.error('Gagal memperbarui ternak')
      console.error('Error updating ternak:', error)
    },
  })
}

export function useDeleteKeuangan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteKeuangan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      toast.success('Transaksi berhasil dihapus')
    },
    onError: (error) => {
      toast.error('Gagal menghapus ternak')
      console.error('Error deleting ternak:', error)
    },
  })
}
