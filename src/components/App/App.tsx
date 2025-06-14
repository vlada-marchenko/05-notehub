
import css from './App.module.css'
import NoteList from '../NoteList/NoteList'
import SearchBox from '../SearchBox/SearchBox'
import Pagination from '../Pagination/Pagination'
import { useEffect, useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchNotes, type HttpResponse } from '../../services/noteService'
import NoteModal from '../NoteModal/NoteModal'
import { useDebounce } from 'use-debounce'



export default function App() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [debouncedSearch] = useDebounce(search, 400)
  const perPage = 12


  const { data, isLoading, error } = useQuery<HttpResponse, Error>({
	queryKey: ['notes', page, debouncedSearch] ,
  queryFn: () => fetchNotes({ search: debouncedSearch, page, perPage }),
	placeholderData: keepPreviousData,
  refetchOnWindowFocus: false
  });

  useEffect(() => {
	setPage(1)
  }, [debouncedSearch])
  
  if (isLoading) return <p>Loading notes...</p>
  if (error) return <p>Error loading notes!</p>

  const notes = data?.notes || []

  function handleModalOpen() {
	setIsModalOpen(true)
  }

  function handleModalClose() {
	setIsModalOpen(false)
  }

  console.log('NOTES RESPONSE', data)

  return <div className={css.app}>
	<header className={css.toolbar}>
    <SearchBox search={search} onSearchChange={setSearch} />
		{data && data.totalPages > 1 && <Pagination page={page} totalPages={data.totalPages || 1} onPageChange={setPage}/>}
		<button className={css.button} onClick={handleModalOpen}>Create note +</button>
		{isModalOpen && <NoteModal onClose={handleModalClose}/>}
  </header>
  {notes.length > 0 && <NoteList notes={notes}/>}
</div>

}
