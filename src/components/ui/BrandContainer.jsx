import { Link } from "react-router-dom"
import Assets from "../../assets/assets"
import { useState } from "react"

function BrandContainer() {
    const [isHoverActive, setIsHoverActive] = useState(false)

    return (
        <Link
            to="/"
            onMouseEnter={() => setIsHoverActive(true)}
            onMouseLeave={() => setIsHoverActive(false)}
            className="flex gap-3 items-center text-black transition duration-100">
            <img src={Assets.logo_dark} alt="logo" width="45px" />
            <span className="text-2xl font-medium">HearMeOut</span>
        </Link>
    )
}

export default BrandContainer