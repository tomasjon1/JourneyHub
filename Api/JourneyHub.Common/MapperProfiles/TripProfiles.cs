using AutoMapper;
using JourneyHub.Common.Models.Domain;
using JourneyHub.Common.Models.Dtos.Requests;
using Newtonsoft.Json;

namespace JourneyHub.Common.MapperProfiles
{
    public class TripProfile : Profile
    {
        public TripProfile()
        {
            CreateMap<PostTripRequestDto, Trip>()
                .ForMember(dest => dest.RouteName, opt => opt.MapFrom(src => src.RouteName))
                .ForMember(dest => dest.RouteDescription, opt => opt.MapFrom(src => src.RouteDescription))
                .ForMember(dest => dest.Visibility, opt => opt.MapFrom(src => src.Visibility))
                .ForMember(dest => dest.MapPoints, opt => opt.MapFrom(src => JsonConvert.SerializeObject(src.MapPoints)))
                .ForMember(dest => dest.MapMarkers, opt => opt.MapFrom(src => JsonConvert.SerializeObject(src.MapMarkers)));
        }
    }
}