import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useFetch } from '@/lib/client-api'
import { FormSchemaType } from '@/schemas/ternak'
import { Ternak } from '@/types/ternak'

const QUERY_KEY = 'ternak' as const

function useBaseQuery<T>({
  endpoint,
  queryKey,
}: {
  endpoint: string
  queryKey: unknown[]
}) {
  const fetcher = useFetch()
  return useQuery({
    queryKey,
    queryFn: () => fetcher<T>(endpoint),
  })
}

function useBaseMutation(endpoint: string, method: 'POST' | 'PUT') {
  const fetcher = useFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: FormSchemaType) =>
      fetcher(endpoint, {
        method,
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success(
        `Ternak berhasil ${method === 'POST' ? 'ditambahkan' : 'diperbarui'}`,
      )
    },
    onError: (error) => {
      toast.error(
        `Gagal ${method === 'POST' ? 'menambahkan' : 'memperbarui'} ternak`,
      )
      console.error(
        `Error ${method === 'POST' ? 'creating' : 'updating'} ternak:`,
        error,
      )
    },
  })
}

export function useTernak() {
  return useBaseQuery<Ternak[]>({
    endpoint: '/ternak',
    queryKey: [QUERY_KEY],
  })
}

export function useTernakDetail(id: string) {
  return useBaseQuery<Ternak>({
    endpoint: `/ternak/${id}`,
    queryKey: [QUERY_KEY, id],
  })
}

export function useUpdateTernak(id: string | number) {
  return useBaseMutation(`/ternak/${id}`, 'PUT')
}

export function useCreateTernak() {
  return useBaseMutation('/ternak', 'POST')
}

export function useDeleteTernak() {
  const fetcher = useFetch()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (ternakId: string | number) =>
      fetcher(`/ternak/${ternakId}`, {
        method: 'DELETE',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ternak'] })
      toast.success('Ternak berhasil dihapus')
    },
    onError: (error) => {
      toast.error('Gagal menghapus ternak')
      console.error('Error deleting ternak:', error)
    },
  })
}
