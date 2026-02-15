import React, { useState, useEffect } from 'react'
import { getClients, deleteClient } from '../services/clientsService'
import type { Client } from '../services/clientsService'
import ClientFormModal from '../components/clients/ClientFormModal'

/* ================= ICONS ================= */

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
)

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5h2m-1-1v2m-4 4l8-8 4 4-8 8H7v-5z" />
  </svg>
)

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

/* ================= PAGE ================= */

const ClientsPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [modalMode, setModalMode] = useState<'create' | 'view' | 'edit'>('create')

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    setLoading(true)
    const data = await getClients()
    setClients(data)
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Deseja excluir esta cliente?')) return
    await deleteClient(id)
    fetchClients()
  }

  const handleView = (client: Client) => {
    setSelectedClient(client)
    setModalMode('view')
    setIsModalOpen(true)
  }

  const handleEdit = (client: Client) => {
    setSelectedClient(client)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedClient(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-brand-800">
            Lista de Clientes ({clients.length})
          </h1>
          <p className="text-sm text-brand-500">
            Gerencie suas clientes e acompanhamentos
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedClient(null);
            setModalMode('create');
            setIsModalOpen(true);
          }}
          className="
    h-11
    px-6
    rounded-xl
    bg-brand-600
    text-white
    text-sm
    font-medium
    shadow-sm
    transition
    hover:bg-brand-700
    active:scale-[0.98]
  "
        >
          + Nova Cliente
        </button>

      </div>

      {/* LOADING */}
      {loading && (
        <div className="text-center py-10 text-brand-600">
          Carregando clientes...
        </div>
      )}

      {/* ================= DESKTOP ================= */}
      {!loading && (
        <div className="hidden md:block bg-white rounded-xl border border-brand-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-brand-50 text-brand-600 uppercase text-xs">
              <tr>
                <th className="px-6 py-4 text-left">Nome</th>
                <th className="px-6 py-4 text-left">Telefone</th>
                <th className="px-6 py-4 text-left">Situação</th>
                <th className="px-6 py-4 text-left">Plano</th>
                <th className="px-6 py-4 text-left">Pagamento</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-brand-100">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-brand-50/40 transition">
                  <td className="px-6 py-4 font-medium text-brand-800">
                    {client.full_name}
                  </td>
                  <td className="px-6 py-4 text-brand-600">
                    {client.phone || '-'}
                  </td>
                  <td className="px-6 py-4 text-brand-600">
                    {client.situation || '-'}
                  </td>
                  <td className="px-6 py-4 text-brand-600">
                    {client.plan || '-'}
                  </td>
                  <td className="px-6 py-4 font-medium text-brand-700">
                    {client.payment_type || 'Pendente'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-4">
                      <button onClick={() => handleView(client)} className="text-brand-500 hover:text-brand-800 transition">
                        <EyeIcon />
                      </button>
                      <button onClick={() => handleEdit(client)} className="text-brand-500 hover:text-brand-800 transition">
                        <EditIcon />
                      </button>
                      <button onClick={() => handleDelete(client.id)} className="text-red-500 hover:text-red-700 transition">
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ===== MOBILE ===== */}
      <div className="md:hidden space-y-5">
        {clients.map((client) => (
          <div
            key={client.id}
            className="
    bg-white
    p-6
    rounded-2xl
    border border-brand-100
    shadow-sm
    transition
    hover:shadow-md
  "
          >
            {/* HEADER */}
            <div className="flex justify-between items-start gap-5">
              <div className="min-w-0">
                <h3 className="
        text-base
        font-semibold
        text-brand-800
        leading-snug
        break-words
      ">
                  {client.full_name}
                </h3>

                <p className="text-sm text-brand-500 mt-2">
                  {client.phone || '-'}
                </p>
              </div>

              {/* AÇÕES */}
              <div className="flex items-center gap-4 shrink-0">
                <button
                  onClick={() => handleView(client)}
                  className="
          w-8 h-8
          flex items-center justify-center
          rounded-lg
          text-brand-400
          hover:bg-brand-50
          hover:text-brand-700
          transition
        "
                >
                  <EyeIcon />
                </button>

                <button
                  onClick={() => handleEdit(client)}
                  className="
          w-8 h-8
          flex items-center justify-center
          rounded-lg
          text-brand-400
          hover:bg-brand-50
          hover:text-brand-700
          transition
        "
                >
                  <EditIcon />
                </button>

                <button
                  onClick={() => handleDelete(client.id)}
                  className="
          w-8 h-8
          flex items-center justify-center
          rounded-lg
          text-red-400
          hover:bg-red-50
          hover:text-red-600
          transition
        "
                >
                  ✕
                </button>
              </div>
            </div>

            {/* BADGES */}
            <div className="flex flex-wrap gap-3 mt-5">
              {client.situation && (
                <span className="
        px-3 py-1.5
        text-xs
        rounded-full
        bg-brand-50
        text-brand-700
        font-medium
      ">
                  {client.situation}
                </span>
              )}

              {client.plan && (
                <span className="
        px-3 py-1.5
        text-xs
        rounded-full
        bg-brand-100
        text-brand-800
        font-medium
      ">
                  {client.plan}
                </span>
              )}

              {client.payment_type && (
                <span className="
        px-3 py-1.5
        text-xs
        rounded-full
        bg-brand-200
        text-brand-900
        font-medium
      ">
                  {client.payment_type}
                </span>
              )}
            </div>
          </div>

        ))}
      </div>


      <ClientFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchClients}
        mode={modalMode}
        initialData={selectedClient}
      />
    </div>
  )
}

export default ClientsPage
