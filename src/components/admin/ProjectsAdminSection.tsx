import React from 'react'
import Link from 'next/link'

type ProjectRow = { id: string; title?: string; slug?: string }

interface Props {
  projects: ProjectRow[]
  openEdit: (row: ProjectRow) => void
  handleDelete: (row: ProjectRow) => void
}

export default function ProjectsAdminSection({ projects, openEdit, handleDelete }: Props) {
  return (
    <div>
      <h2>Projects</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Title</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Slug</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((row) => (
            <tr key={row.id}>
              <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{row.title || '-'}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{row.slug || '-'}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #eee', display: 'flex', gap: 8 }}>
                <Link href={`/admin/projects/${row.id}`}>Manage</Link>
                <button onClick={() => openEdit(row)}>Edit</button>
                <button onClick={() => handleDelete(row)}>Delete</button>
              </td>
            </tr>
          ))}
          {projects.length === 0 && (
            <tr>
              <td colSpan={3} style={{ padding: 8 }}>No projects</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
