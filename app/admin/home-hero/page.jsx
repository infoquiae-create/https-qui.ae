'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'
import toast from 'react-hot-toast'


// Reusable editor for a HomeSelection section
function SectionEditor({ label, sectionKey, maxSlides = 3 }){
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectionId, setSelectionId] = useState(null)
  const [form, setForm] = useState({
    section: sectionKey,
    title: label,
    subtitle: '',
    bannerCtaText: 'Shop Now',
    bannerCtaLink: '/shop',
    isActive: true,
    sortOrder: 0,
    slides: [], // array of image URLs only
  })

  // Load existing selection
  useEffect(() => { (async () => {
    try {
      const res = await fetch(`/api/home-selection?section=${encodeURIComponent(sectionKey)}`, { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      const sel = data?.selection
      if (sel) {
        setSelectionId(sel.id)
        setForm(f => ({
          ...f,
          title: sel.title || f.title,
          subtitle: sel.subtitle || '',
          bannerCtaText: sel.bannerCtaText || f.bannerCtaText,
          bannerCtaLink: sel.bannerCtaLink || f.bannerCtaLink,
          isActive: typeof sel.isActive === 'boolean' ? sel.isActive : true,
          sortOrder: sel.sortOrder ?? 0,
          slides: Array.isArray(sel.slides) ? sel.slides : [],
        }))
      }
    } catch (e) { console.error(e) } finally { setLoading(false) }
  })() }, [sectionKey])

  const uploadImage = async (file, index = null) => {
    const fd = new FormData(); fd.append('image', file)
    try {
      const { data } = await axios.post('/api/admin/upload-image', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      const url = data?.url || data?.imageUrl
      if (!url) return toast.error('Upload failed')
      if (index === null) {
        setForm(f => ({ ...f, slides: [...f.slides, url].slice(0, maxSlides) }))
      } else {
        setForm(f => { const s = [...f.slides]; s[index] = url; return { ...f, slides: s } })
      }
    } catch (e) { toast.error('Upload failed') }
  }

  const removeSlide = (i) => setForm(f => ({
    ...f,
    slides: f.slides.filter((_, x) => x !== i),
    slidesData: Array.isArray(f.slidesData) ? f.slidesData.filter((_, x) => x !== i) : f.slidesData
  }))

  const save = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form, slides: (form.slides || []).slice(0, maxSlides) }
      if (selectionId) {
        await axios.put(`/api/admin/home-sections/${selectionId}`, payload)
      } else {
        const { data } = await axios.post('/api/admin/home-sections', payload)
        setSelectionId(data?.section?.id)
      }
      toast.success(`${label} saved`)
    } catch (e) { toast.error(e?.response?.data?.error || 'Save failed') } finally { setSaving(false) }
  }

  if (loading) return (
    <div className='border rounded-xl p-6'>Loading {label}…</div>
  )

  return (
    <form onSubmit={save} className='bg-white border rounded-xl shadow p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold'>{label}</h2>
        <div className='text-xs text-gray-500'>Section key: {sectionKey}</div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div>
          <label className='block text-sm text-gray-600'>Title</label>
          <input className='w-full border rounded-lg px-3 py-2' value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        </div>
        <div>
          <label className='block text-sm text-gray-600'>Subtitle</label>
          <input className='w-full border rounded-lg px-3 py-2' value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='block text-sm text-gray-600'>CTA Text</label>
          <input className='w-full border rounded-lg px-3 py-2' value={form.bannerCtaText} onChange={e => setForm({ ...form, bannerCtaText: e.target.value })} />
        </div>
        <div>
          <label className='block text-sm text-gray-600'>CTA Link</label>
          <input className='w-full border rounded-lg px-3 py-2' value={form.bannerCtaLink} onChange={e => setForm({ ...form, bannerCtaLink: e.target.value })} placeholder='/shop' />
        </div>
        <label className='flex items-center gap-2'><input type='checkbox' checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} /> Active</label>
      </div>

      <div className='space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm font-medium text-gray-800'>Slides (max {maxSlides})</h3>
          <input type='file' accept='image/*' onChange={e => e.target.files && uploadImage(e.target.files[0], null)} />
        </div>
        {form.slides.length === 0 && (
          <p className='text-sm text-gray-500'>No slides yet. Upload an image to add a slide.</p>
        )}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {form.slides.map((it, i) => {
            let url = it
            try{
              if(typeof it === 'string' && it.trim().startsWith('{')){
                const parsed = JSON.parse(it)
                if(parsed?.image) url = parsed.image
              }
            }catch{}
            return (
            <div key={i} className='border rounded-lg p-4 space-y-2'>
              <img src={url} className='w-full aspect-video object-cover rounded-md border' />
              <div className='flex items-center justify-between gap-2'>
                <input type='file' accept='image/*' onChange={e => e.target.files && uploadImage(e.target.files[0], i)} />
                <button type='button' className='text-red-600 text-sm' onClick={() => removeSlide(i)}>Remove</button>
              </div>
            </div>
            )
          })}
        </div>
        
      </div>

      <div className='flex items-center gap-3 justify-end'>
        <button disabled={saving} className='px-4 py-2 bg-black text-white rounded-lg'>{saving ? 'Saving…' : `Save ${label}`}</button>
      </div>
    </form>
  )
}

export default function AdminHomeHeroPage() {
  return (
    <div className='max-w-6xl mx-auto p-6 space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Admin · Home Hero</h1>
        <Link href='/admin/home-sections' className='text-sm text-blue-600'>Home Sections</Link>
      </div>

      {/* Section 1: Main banner with 3 slides */}
      <SectionEditor label='Section 1 · Main Hero' sectionKey='home_hero' maxSlides={3} />

      {/* Section 2: Right Card Top */}
      <SectionEditor label='Section 2 · Right Card (Top)' sectionKey='home_hero_right_1' maxSlides={3} />

      {/* Section 3: Right Card Bottom */}
      <SectionEditor label='Section 3 · Right Card (Bottom)' sectionKey='home_hero_right_2' maxSlides={3} />
    </div>
  )
}
