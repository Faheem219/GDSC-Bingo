import { useState } from 'react'
import TopBar from './TopBar'
import gdscLogo from '../assets/gdsc.png'
import { api, utils } from '../utils/api'

const WelcomeScreen = ({ onRegister }) => {
    const [formData, setFormData] = useState({
        name: '',
        mobile: ''
    })
    const [loading, setLoading] = useState(false)

    const COLORS = {
        darkNavy: '#0B083F',
        secondaryDark: '#3C3C59',
        darkGray: '#33333C'
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.name && formData.mobile) {
            setLoading(true)
            try {
                // Validate inputs
                if (!utils.validatePlayerName(formData.name)) {
                    alert('Name must be between 2-50 characters')
                    return
                }
                if (!utils.validateMobileNumber(formData.mobile)) {
                    alert('Please enter a valid mobile number')
                    return
                }

                // Create player data
                const playerData = {
                    ...formData,
                    id: utils.generatePlayerId(),
                    tag: utils.generatePlayerTag(formData.name)
                }

                // Register player via API
                const result = await api.registerPlayer(playerData)
                console.log('Player registered:', result)

                onRegister(playerData)
            } catch (error) {
                console.error('Registration failed:', error)
                alert('Registration failed. Please try again.')
            } finally {
                setLoading(false)
            }
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
                        disabled={loading || !formData.name.trim() || !formData.mobile.trim()}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition-colors"
                    >
                        {loading ? 'Registering...' : 'Start Playing'}
                    </button>
                </form>
            </div>
        </div >
    )
}

export default WelcomeScreen
