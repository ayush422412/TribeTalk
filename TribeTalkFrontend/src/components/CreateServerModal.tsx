import { useState } from "react"
import { useCreateServerMutation } from "../features/servers/server.api"

type CreateServerModalProps = {
  isOpen: boolean
  onClose: () => void
}

const CreateServerModal = ({ isOpen, onClose }: CreateServerModalProps) => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [createServer, { isLoading, isError }] = useCreateServerMutation()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createServer({ name, description }).unwrap()
      setName("")
      setDescription("")
      onClose() // close modal
    } catch (err) {
      console.error("Failed to create server", err)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-900 text-white p-6 rounded w-96">
        <h2 className="text-xl font-bold mb-4">Create New Server</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Server Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded text-black"
              required
            />
          </div>

          {isError && <p className="text-red-500 text-sm">Failed to create server.</p>}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
            >
              {isLoading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateServerModal
