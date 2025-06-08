import FeatureItem from '../FeatureItem/FeatureItem'
import chatIcon from '../../assets/icon-chat.webp'
import moneyIcon from '../../assets/icon-money.webp'
import securityIcon from '../../assets/icon-security.webp'
import './Features.css'

function Features() {
    const featuresData = [
        {
            icon: chatIcon,
            title: "You are our #1 priority",
            description: "Need to talk to a representative? You can get in touch through our 24/7 chat or through a phone call in less than 5 minutes."
        },
        {
            icon: moneyIcon,
            title: "More savings means higher rates",
            description: "The more you save with us, the higher your interest rate will be!"
        },
        {
            icon: securityIcon,
            title: "Security you can trust",
            description: "We use top of the line encryption to make sure your data and money is always safe."
        }
    ]

    return (
        <section className="features">
            <h2 className="sr-only">Features</h2>
            {featuresData.map((feature, index) => (
                <FeatureItem
                    key={index}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                />
            ))}
        </section>
    )
}

export default Features