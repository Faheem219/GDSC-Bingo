import { useState } from 'react'
import TopBar from './TopBar'
import gdscLogo from '../assets/gdsc.png'

const WelcomeScreen = ({ onRegister }) => {
    const [formData, setFormData] = useState({
        name: '',
        mobile: ''
    })

    const COLORS = {
        darkNavy: '#0B083F',
        secondaryDark: '#3C3C59',
        darkGray: '#33333C'
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.name && formData.mobile) {
            // Here you would make an API call to POST /api/auth/register
            const playerData = {
                ...formData,
                id: `GDSC${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                tag: `${formData.name.split(' ')[0]}-${Math.random().toString(36).substr(2, 4)}`
            }
            onRegister(playerData)
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    return (
        <div className="min-h-screen relative flex items-center justify-center" style={{ backgroundColor: COLORS.darkNavy }}>
            <TopBar showTag={false} />

            <div className="text-center max-w-md w-full px-6">
                {/* GDSC Logo */}
                <div className="mb-8">
                    <img
                        src={gdscLogo}
                        alt="GDSC Logo"
                        className="w-20 h-20 mx-auto mb-4"
                    />
                    <h1 className="text-white text-2xl font-bold mb-2">GDSC</h1>
                    <p className="text-gray-300 text-sm">Google Developer Student Clubs</p>
                </div>

                {/* GridMates Section */}
                <div className="mb-8">
                    <h2 className="text-white text-3xl font-bold mb-4">GRIDMATES</h2>
                    <p className="text-gray-300 text-sm leading-relaxed">
                        "Mark squares, make friends -<br />
                        one connection at a time."
                    </p>
                </div>

                {/* Registration Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-4 rounded-xl bg-white bg-opacity-10 text-black placeholder-gray-300 border border-gray-600 focus:border-blue-400 focus:outline-none"
                        required
                    />
                    <input
                        type="tel"
                        name="mobile"
                        placeholder="Enter your mobile number"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full px-4 py-4 rounded-xl bg-white bg-opacity-10 text-black placeholder-gray-300 border border-gray-600 focus:border-blue-400 focus:outline-none"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                        Start Playing
                    </button>
                </form>
            </div>
        </div >
    )
}

export default WelcomeScreen
