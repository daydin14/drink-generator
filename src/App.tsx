import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { DrinkPage } from './pages/DrinkPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RandomPage } from './pages/RandomPage'
import { SearchPage } from './pages/SearchPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="random" element={<RandomPage />} />
        <Route path="drink/:id" element={<DrinkPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
