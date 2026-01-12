import React from 'react'
import { useParams, Link } from 'react-router-dom'
import Navbar from '../components/Navbar'; import Sidebar from '../components/Sidebar'
export default function CourseView() { const { id } = useParams(); const chapters = [{ id: 1, title: 'Algebra Basics' }, { id: 2, title: 'Linear Equations' }]; return (<div><Navbar /><div style={{ display: 'grid', gridTemplateColumns: '220px 1fr' }}><Sidebar /><div style={{ padding: 16 }}><h2>Course #{id}</h2><ul>{chapters.map(ch => (<li key={ch.id}><Link to={`/course/${id}/chapter/${ch.id}`}>{ch.title}</Link></li>))}</ul></div></div></div>) }
