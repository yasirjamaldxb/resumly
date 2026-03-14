import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-[#eef4ff] to-white overflow-hidden pt-12 pb-8">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side */}
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6">
              This resume
              <br />
              builder gets you
              <br />
              <span className="text-blue-600">a remote job</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Only 2% of resumes win. Ours are in that 2%. Use our AI resume builder and get hired at top companies.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button size="xl" asChild>
                <Link href="/resume-builder">Create my resume</Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/resume-templates">Upload my resume</Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                4 million+ users
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                <span className="font-semibold text-gray-700">Trustpilot</span>
                <span>4.5 out of 5</span>
              </div>
            </div>
          </div>

          {/* Right side - Browser mockup */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gray-100 border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-gray-400 text-center">resumly.app/builder</div>
              </div>
              <div className="flex h-[380px]">
                <div className="w-72 border-r border-gray-100 p-4 bg-white space-y-3 overflow-hidden">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 bg-blue-600 rounded" />
                    <div className="h-2.5 bg-gray-300 rounded w-20" />
                  </div>
                  <div className="flex gap-1 mb-3">
                    {['bg-blue-600','bg-blue-200','bg-blue-200','bg-blue-200'].map((c,i)=>(<div key={i} className={`h-1 flex-1 rounded-full ${c}`}/>))}
                  </div>
                  <div className="space-y-2.5">
                    {[{w:'w-20'},{w:'w-28'},{w:'w-32'}].map((f,i)=>(
                      <div key={i}>
                        <div className="h-2 bg-gray-200 rounded w-14 mb-1"/>
                        <div className="h-7 bg-gray-50 border border-gray-200 rounded flex items-center px-2">
                          <div className={`h-2 bg-gray-300 rounded ${f.w}`}/>
                        </div>
                      </div>
                    ))}
                    <div>
                      <div className="h-2 bg-gray-200 rounded w-20 mb-1"/>
                      <div className="h-14 bg-gray-50 border border-gray-200 rounded p-2 space-y-1">
                        <div className="h-1.5 bg-gray-200 rounded w-full"/>
                        <div className="h-1.5 bg-gray-200 rounded w-4/5"/>
                        <div className="h-1.5 bg-gray-200 rounded w-full"/>
                      </div>
                    </div>
                  </div>
                  <div className="h-8 bg-blue-600 rounded flex items-center justify-center gap-1.5">
                    <div className="w-3 h-3 bg-white rounded-full opacity-80"/>
                    <div className="h-2 bg-white rounded w-14 opacity-80"/>
                  </div>
                </div>
                <div className="flex-1 bg-gray-50 p-4 flex items-start justify-center overflow-hidden">
                  <div className="bg-white shadow-md rounded w-48 h-64 p-2.5">
                    <div style={{borderBottom:'2px solid #2563eb',paddingBottom:4,marginBottom:6}}>
                      <div className="h-3 bg-gray-800 rounded w-3/4 mb-1"/>
                      <div className="h-2 bg-blue-600 rounded w-1/2 mb-1"/>
                      <div className="flex gap-1.5">
                        <div className="h-1.5 bg-gray-300 rounded w-10"/>
                        <div className="h-1.5 bg-gray-300 rounded w-10"/>
                      </div>
                    </div>
                    {['Summary','Experience'].map(s=>(
                      <div key={s} className="mb-2">
                        <div className="h-1.5 bg-blue-600 rounded w-12 mb-1"/>
                        <div className="space-y-0.5">
                          <div className="h-1 bg-gray-100 rounded w-full"/>
                          <div className="h-1 bg-gray-100 rounded w-5/6"/>
                          <div className="h-1 bg-gray-100 rounded w-4/5"/>
                        </div>
                      </div>
                    ))}
                    <div className="mt-2 bg-green-50 border border-green-200 rounded p-1 flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"/>
                      <div className="h-1.5 bg-green-300 rounded w-10"/>
                      <div className="h-1.5 bg-green-600 rounded w-6 ml-auto"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
