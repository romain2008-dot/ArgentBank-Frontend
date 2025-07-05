import FeatureItem from '../FeatureItem/FeatureItem'
import './Features.css'
import featuresData from '../../data/features.json'

function Features() {
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